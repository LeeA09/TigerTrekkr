<script>
    import { goto } from '\$app/navigation';

    import { font_size, selected_difficulty } from '$lib/stores/settings';

    import Settings from '$lib/modals/Settings.svelte';
    import Help from '$lib/modals/Help.svelte';
    import Info from '$lib/modals/Info.svelte';
    import Pause from '$lib/modals/Pause.svelte';
    import Skip from '$lib/modals/Skip.svelte';
    import End from '$lib/modals/End.svelte';

    import { onMount } from 'svelte';

    // Load Leaflet and OpenStreetMap tiles
    onMount(() => {
        if (typeof window !== 'undefined' && window.L) {
            leaflet_loaded = true;
            return;
        }
        const css_link = document.createElement('link');
        css_link.rel = 'stylesheet';
        css_link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(css_link);
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => { leaflet_loaded = true; };
        document.head.appendChild(script);
    });

    // Load Marzipano
    let marzipano_loaded = $state(false);
    let panorama_container = $state();
    let marzipano_viewer = null;
    let marzipano_scene = null;
    onMount(() => {
        if (typeof window !== 'undefined' && window.Marzipano) {
            marzipano_loaded = true;
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marzipano@0.10.2/dist/marzipano.js';
        script.onload = () => { marzipano_loaded = true; };
        script.onerror = () => { console.error('Failed to load Marzipano.'); };
        document.head.appendChild(script);
    });

    // Initialize / tear down 360 image display
    $effect(() => {
        if (marzipano_loaded && panorama_container && !marzipano_viewer) {
            marzipano_viewer = new window.Marzipano.Viewer(panorama_container, {
                controls: {
                    mouseViewMode: 'drag'
                }
            });
            const source = window.Marzipano.ImageUrlSource.fromString('/sample-360-image.jpg');
            const geometry = new window.Marzipano.EquirectGeometry([{ width: 4096 }]);
            // Keep the existing zoom limits for every difficulty.
            const traditionalLimiter =
                window.Marzipano.RectilinearView.limit.traditional(
                    4096,
                    120 * Math.PI / 180
                );
            // Difficulty controls how far the player can rotate horizontally:
            // Easy   = full 360° rotation
            // Medium = 180° total rotation (-90° to +90°)
            // Hard   = no rotation (yaw and pitch locked), but zoom remains enabled
            let limiter;
            if ($selected_difficulty === 'easy') {
                limiter = traditionalLimiter;
            } else if ($selected_difficulty === 'medium') {
                limiter = window.Marzipano.util.compose(
                    traditionalLimiter,
                    window.Marzipano.RectilinearView.limit.yaw(
                        -45 * Math.PI / 180,
                        45 * Math.PI / 180
                    )
                );
            } else {
                limiter = window.Marzipano.util.compose(
                    traditionalLimiter,
                    window.Marzipano.RectilinearView.limit.yaw(0, 0),
                    window.Marzipano.RectilinearView.limit.pitch(0, 0)
                );
            }
            const view = new window.Marzipano.RectilinearView(
                { yaw: 0, pitch: 0, fov: 90 * Math.PI / 180 },
                limiter
            );
            marzipano_scene = marzipano_viewer.createScene({
                source,
                geometry,
                view,
                pinFirstLevel: true
            });
            marzipano_scene.switchTo();
        }
        // if (current_view !== 'play' && marzipano_viewer) {
        //     marzipano_viewer.destroy();
        //     marzipano_viewer = null;
        //     marzipano_scene = null;
        // }
    });

    // Initialize / tear down map display
    $effect(() => {
        if (leaflet_loaded && map_container && !leaflet_map) {
            // Define Mizzou campus boundary (Southwest to Northeast lat/lng)
            const mizzouBounds = window.L.latLngBounds(
                [38.9320, -92.3420], // Southwest corner (Mizzou Sports Park / Providence)
                [38.9580, -92.3150]  // Northeast corner (College Ave / East Campus)
            );
            leaflet_map = window.L.map(map_container, {
                zoomControl: false,
                attributionControl: true,
                fadeAnimation: false,  // Prevents initial tile fade transparency gap
                maxBounds: mizzouBounds, // Restricts panning area strictly to Mizzou
                maxBoundsViscosity: 1.0, // Hard wall constraint; stops rubber-banding outside bounds
                minZoom: 15            // Prevents zooming out past campus area
            }).setView([38.9453, -92.3288], 16);
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                minZoom: 15,
                keepBuffer: 8,         // Pre-loads extra rows/columns of tiles around the viewport
                updateWhenIdle: false, // Forces continuous tile loading while panning instead of waiting for end
                updateWhenZooming: false,
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(leaflet_map);
            window.L.control.zoom({ position: 'topright' }).addTo(leaflet_map);
            // Custom Duck Icon for guessing marker
            const duckIcon = window.L.icon({
                iconUrl: 'tiger-trekkr-logo.ico',
                iconSize: [20, 20],
                iconAnchor: [10, 10],
                popupAnchor: [0, -20]
            });
            // Map click listener to place/move duck marker
            leaflet_map.on('click', (e) => {
                if (guess_marker) {
                    guess_marker.setLatLng(e.latlng);
                } else {
                    guess_marker = window.L.marker(e.latlng, { icon: duckIcon }).addTo(leaflet_map);
                }
                guess_placed = true;
            });
            // Dynamically recalculate dimensions immediately when container size changes
            const resizeObserver = new ResizeObserver(() => {
                leaflet_map && leaflet_map.invalidateSize();
            });
            resizeObserver.observe(map_container);
            return () => {
                resizeObserver.disconnect();
            };
        }
        // if (current_view !== 'play' && leaflet_map) {
        //     leaflet_map.remove();
        //     leaflet_map = null;
        //     guess_marker = null;
        //     guess_placed = false;
        //     is_map_expanded = false;
        // }
    });

    // Render Leaflet tiles smoothly when map expand size
    $effect(() => {
        if (leaflet_map && is_map_expanded !== undefined) {
            leaflet_map.invalidateSize();
            setTimeout(() => {
                leaflet_map && leaflet_map.invalidateSize();
            }, 300);
        }
    });

    // Game timer
    let time_remaining = $state(300);
    let formatted_time = $derived(
        `${Math.floor(time_remaining / 60).toString().padStart(2, '0')}:${(time_remaining % 60).toString().padStart(2, '0')}`
    );
    $effect(() => {
        if (time_remaining > 0) {
            const timer = setInterval(() => {
                if (time_remaining > 0) {
                    time_remaining -= 1;
                }
            }, 1000);
            return () => clearInterval(timer);
        }
    });

    // Go to answer screen when timer expires on play screen
    $effect(() => {
        if (time_remaining === 0) {
            goto('/answer');
        }
    });

    // play screen map (Leaflet + OpenStreetMap)
	let map_container = $state();
	let leaflet_loaded = $state(false);
	let leaflet_map = null;
	let is_map_expanded = $state(false);

    // map guessing state
    let guess_placed = $state(false);
    let guess_marker = null;

	function toggle_map_expand() { is_map_expanded = !is_map_expanded; }

    function submit_guess() { goto('/answer'); }

    // utility modals
    let is_settings_open = $state(false);
    let is_help_open = $state(false);
    let is_info_open = $state(false);
    function open_settings() { is_settings_open = true; }
	function close_settings() { is_settings_open = false; }
	function open_help() { is_help_open = true; }
	function close_help() { is_help_open = false; }
	function open_info() { is_info_open = true; }
	function close_info() { is_info_open = false; }

    // confirmation modals
    let is_pause_open = $state(false);
    let is_skip_open = $state(false);
    let is_end_open = $state(false);
    function open_pause() { is_pause_open = true; }
    function close_pause() { is_pause_open = false; }
    function open_skip() { is_skip_open = true; }
    function close_skip() { is_skip_open = false; }
    function open_end() { is_end_open = true; }
    function close_end() { is_end_open = false; }

    // settings
    let is_sound_on = $state(true);
    let is_music_on = $state(true);
    function toggle_music() { is_music_on = !is_music_on; }
	function toggle_sound() { is_sound_on = !is_sound_on; }
</script>

<div class="page" style={`--font-size: ${$font_size}px`}>
    <div class="page-background">
        <header class="top-bar">
            <button class="top-bar-home-link" onclick={open_end} title="Return to Home" aria-label="Return to Home">
                <span class="top-bar-home-title">TigerTrekkr</span>
            </button>

            <div class="top-bar-center">
                <button class="utility-button button-pause" onclick={open_pause} title="Pause" aria-label="Pause">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                        <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                    </svg>
                </button>
                <button class="utility-button button-skip" onclick={open_skip} title="Skip" aria-label="Skip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="5 4 15 12 5 20 5 4"></polygon>
                        <line x1="19" y1="5" x2="19" y2="19"></line>
                    </svg>
                </button>
                <div class="timer-display">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="timer-icon">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{formatted_time}</span>
                </div>
                {#if $selected_difficulty}
                    <span class="difficulty-badge difficulty-{$selected_difficulty}">
                        {$selected_difficulty}
                    </span>
                {/if}
            </div>

            <div class="button-circle-top">
                <button class="utility-button" title="Settings" aria-label="Settings" onclick={open_settings}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </button>
                <button class="utility-button" title="Help" aria-label="Help" onclick={open_help}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                </button>
                <button class="utility-button" title="Info" aria-label="Info" onclick={open_info}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                </button>
            </div>
        </header>
        <div class="play-body">
            <div class="pano" bind:this={panorama_container}></div>
            <div class="map-container" class:expanded={is_map_expanded}>
                <div class="map-buttons">
                    <button class="button-map-expand" onclick={toggle_map_expand}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            {#if is_map_expanded}
                                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                            {:else}
                                <path d="M3 9V3h6M3 3l7 7M21 15v6h-6M21 21l-7-7"></path>
                            {/if}
                        </svg>
                    </button>
                </div>
                <div class="map-map" bind:this={map_container}></div>
                {#if guess_placed}
                    <button class="button-guess" onclick={submit_guess}>
                        Submit
                    </button>
                {/if}
            </div>
        </div>
    </div>
    {#if is_settings_open}
        <Settings onClose={close_settings} />
    {/if}
    {#if is_help_open}
        <Help onClose={close_help} />
    {/if}
    {#if is_info_open}
        <Info onClose={close_info} />
    {/if}
    {#if is_pause_open}
        <Pause onClose={close_pause} />
    {/if}
    {#if is_skip_open}
        <Skip onClose={close_skip} />
    {/if}
    {#if is_end_open}
        <End onClose={close_end} />
    {/if}
</div>

<style>
    :global(html),
    :global(body) {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
        font-family: "Actor", sans-serif;
    }
</style>