<script>
    import { goto } from '\$app/navigation'
    import { font_size, selected_difficulty } from '$lib/stores/settings'
    import { onMount } from 'svelte'
    import { timerSeconds } from '$lib/stores/timer'

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
    });

    // Initialize / tear down map display
    $effect(() => {
        if (leaflet_loaded && map_container && !leaflet_map) {
            // Define Mizzou campus boundary (Southwest to Northeast lat/lng)
            const mizzouBounds = window.L.latLngBounds(
                [38.949697, -92.314951], // Southwest corner (Mizzou Sports Park / Providence)
                [38.927023, -92.346998]  // Northeast corner (College Ave / East Campus)
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

    // play screen map (Leaflet + OpenStreetMap)
	let map_container = $state();
	let leaflet_loaded = $state(false);
	let leaflet_map = null;
	let is_map_expanded = $state(false);

    // map guessing state
    let guess_placed = $state(false);
    let guess_marker = null;

    function toggle_map_expand() { is_map_expanded = !is_map_expanded; }

    // GIVE TIMERSECONDS TO BACKEND HERE
    function submit_guess() { goto('/answer'); }
</script>

<div class="page" style={`--font-size: ${$font_size}px`}>
    <div class="page-background">
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
