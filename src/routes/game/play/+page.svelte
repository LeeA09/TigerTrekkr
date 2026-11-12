<script>
    import { goto } from '$app/navigation'
    import { font_size, is_sound_on } from '$lib/stores/settings'
    import { onMount } from 'svelte'
    import { MainHeader } from '$lib/shared/headers'
    import { MapExpandIcon } from '$lib/shared/icons'
    import { currentLocIdx, currentLocation, roundResult, sessionResults, sessionLocations, timerSeconds, is_timer_active, selected_difficulty } from '$lib/stores/game'
    import { modal, Quit } from '$lib/modals'
    import { setupPanorama, setupLeafletMap } from '$lib/shared/scripts'

    let panorama_container = $state();
    let map_container = $state();
    let image_url = $state(null);
    let leaflet_map = null;
    let is_map_expanded = $state(false);

    let guess_placed = $state(false);
    let guess_marker_latlng = $state(null);

    const clickAudio = new Audio('/audiomass-output.mp3');

    function toggle_map_expand() { is_map_expanded = !is_map_expanded; }

    let is_submitting = $state(false);

    onMount(() => {
        timerSeconds.set(60);
        is_timer_active.set(false);
        getLocation();
    });

    // MarzipanoPanorama Effect
    $effect(() => {
        if (panorama_container && image_url) {
            let cleanupFn;

            setupPanorama({
                container: panorama_container,
                imageUrl: image_url,
                difficulty: $selected_difficulty,
                onLoading: (isLoading) => {
                    // Handle loading state here
                },
                onReady: () => {
                    is_timer_active.set(true);
                }
            }).then((destroy) => {
                cleanupFn = destroy;
            });

            return () => {
                if (cleanupFn) cleanupFn();
            };
        }
    });

    // Leaflet Map Effect
    $effect(() => {
        if (map_container) {
            let mapCleanup;
            setupLeafletMap({
                container: map_container,
                onMapClick: (latlng) => {
                    if ($is_sound_on) {
                        clickAudio.currentTime = 0;
                        clickAudio.play().catch(err => console.error("Audio playback failed:", err));
                    }
                    guess_marker_latlng = latlng;
                    guess_placed = true;
                }
            }).then((res) => {
                if (res) {
                    leaflet_map = res.map;
                    mapCleanup = res.cleanup;
                }
            });

            return () => {
                if (mapCleanup) mapCleanup();
            };
        }
    });

    // Invalidate map size when expanded
    $effect(() => {
        if (leaflet_map && is_map_expanded !== undefined) {
            leaflet_map.invalidateSize();
            setTimeout(() => {
                leaflet_map && leaflet_map.invalidateSize();
            }, 300);
        }
    });

    async function getLocation() {
        if($currentLocIdx <= 0){ await setUpGame() }
        currentLocation.set($sessionLocations[$currentLocIdx++])
        image_url = $currentLocation.tile_url_template
    }

    async function setUpGame() {
        try {
            const response = await fetch('/api/game/setup');

            if (!response.ok) {
                throw new Error('Failed to fetch location.');
            }

            const data = await response.json();
            sessionLocations.set(data.locations);
        } catch (err) {
            console.error('Could not fetch location:', err);
        }
    }

    async function submit_guess(other_guess) {
        is_submitting = true;
        let guess = other_guess ? other_guess : guess_marker_latlng;

        try {
            const response = await fetch('/api/game/guess', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Send the guess coordinates, time taken, and difficulty to the backend
                body: JSON.stringify({
                    locationId: $currentLocation.image_id,
                    guessedLat: guess.lat,
                    guessedLng: guess.lng,
                    seconds: $timerSeconds,
                    difficulty: $selected_difficulty,
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit guess.');
            }

            const result = await response.json();
            roundResult.set(result);
            const saveResult = result.roundResult
            if(saveResult.score) {
                sessionResults.update(results => [...results, saveResult]);
            }
            
            document.cookie = "from_game=true; path=/; SameSite=Strict";
            goto('/game/answer');
        } catch (err) {
            console.error('Error submitting guess:', err);
        }
	    is_submitting = false;
    }

    $effect(() => {
        // SUBMIT GUESS WITH TIMER RUNOFF IDENTIFIERS
        if ($timerSeconds === 0) { submit_guess({ lat: 100, lng: 200 }) }
    });
</script>

<div class="page" style={`--font-size: ${$font_size}px`}>
    <div class="page-background">
        <MainHeader isPlay={true} home={() => modal.open(Quit)} skip={() => submit_guess({ lat: 100, lng: 200 })} />
        <div class="play-body">
            <div class="pano" bind:this={panorama_container}></div>
            {#if !$is_timer_active}
        	<div class="loading-overlay">
                    <p>Loading Panorama...</p>
        	</div>
    	    {/if}
            <div class="bottom-left-hud">
                <span class="game-display-banner round-counter">
                    Round {$currentLocIdx}/3
                </span>
                {#if $selected_difficulty}
                <span class="difficulty-badge difficulty-{$selected_difficulty}">
                    {$selected_difficulty}
                </span>
                {/if}
            </div>
	        <div class="map-container" class:expanded={is_map_expanded}>
                <div class="map-buttons">
                    <button class="button-map-expand" onclick={toggle_map_expand}>
                        <MapExpandIcon expanded={is_map_expanded} />
                    </button>
                </div>
                <div class="map-map" bind:this={map_container}></div>
                {#if guess_placed}
                    <button class="button-guess" onclick={() => submit_guess(null)} disabled={is_submitting}>
                        Submit
                    </button>
                {/if}
            </div>
        </div>
    </div>
</div>
