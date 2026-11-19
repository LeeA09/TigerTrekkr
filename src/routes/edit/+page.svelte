<script lang="ts">
    import { goto, refreshAll } from '$app/navigation';
    import { page } from '$app/state';
    import { font_size } from '$lib/stores/settings';
    import { onMount } from 'svelte';
    import { MainHeader } from '$lib/shared/headers';
    import { setupLeafletMap, setupPanorama, renderCorrectMarker } from '$lib/shared/scripts';
    import { enhance } from '$app/forms'

    let locations = page?.data?.locations ?? [];

    let selected_index = $state(0);

    let current_location = $derived(locations[selected_index] ?? null);
    let image_url = $derived(current_location?.imageUrl_template ?? null);
    let correct_location = $derived(current_location?.correctLocation ?? { lat: 38.9353, lng: -92.3300 });
    let description = $derived(current_location?.description ?? 'No description available.');

    let isEditingDescription = $state(false);
    let isEditingLatLng = $state(false);
    let newDescription = $state('');
    let draftLat = $state(0);
    let draftLng = $state(0);

    let isSavingUpdate = $state(false);
    let descriptionError = $state('');
    let coordinateError = $state('');

    function start_editing_description() {
        newDescription = description;
        descriptionError = '';
        isEditingDescription = true;
    }

    let draft_marker: any = null;

    function start_editing_coordinates() {
        draftLat = correct_location.lat;
        draftLng = correct_location.lng;
        coordinateError = '';
        isEditingLatLng = true;

        if (leaflet_map && L_instance) {
            if (correct_marker) correct_marker.remove();
            
            draft_marker = L_instance.marker([draftLat, draftLng], { draggable: true }).addTo(leaflet_map);
            
            draft_marker.on('dragend', (e) => {
                const pos = e.target.getLatLng();
                draftLat = Number(pos.lat.toFixed(5));
                draftLng = Number(pos.lng.toFixed(5));
            });

            leaflet_map.on('click', onMapClickForCoordinates);
        }
    }

    function onMapClickForCoordinates(e) {
        if (!isEditingLatLng) return;
        draftLat = Number(e.latlng.lat.toFixed(5));
        draftLng = Number(e.latlng.lng.toFixed(5));
        if (draft_marker) {
            draft_marker.setLatLng([draftLat, draftLng]);
        }
    }

    function cancel_editing_description() {
        isEditingDescription = false;
        descriptionError = '';
        newDescription = description;
    }

    function cancel_editing_coordinates() {
        isEditingLatLng = false;
        coordinateError = '';
        if (leaflet_map) {
            leaflet_map.off('click', onMapClickForCoordinates);
        }
        if (draft_marker) {
            draft_marker.remove();
            draft_marker = null;
        }
        const fs = $font_size;
        correct_marker = renderCorrectMarker(leaflet_map, L_instance, correct_location, fs);
    }

    function handle_description_update() {
        isSavingUpdate = true;
        descriptionError = '';

        return async ({ result }) => {
            isSavingUpdate = false;
            const data = result.data ?? result;

            if (data?.success) {
                isEditingDescription = false;
                await refreshAll();
            } else {
                descriptionError = data?.error ?? 'An error occurred';
                console.log(descriptionError);
            }
        };
    }

    function handle_coordinates_update() {
        isSavingUpdate = true;
        coordinateError = '';

        return async ({ result }) => {
            isSavingUpdate = false;
            const data = result.data ?? result;

            if (data?.success) {
                isEditingLatLng = false;
                if (leaflet_map) {
                    leaflet_map.off('click', onMapClickForCoordinates);
                }
                if (draft_marker) {
                    draft_marker.remove();
                    draft_marker = null;
                }
                if (locations[selected_index]?.correctLocation) {
                    locations[selected_index].correctLocation.lat = draftLat;
                    locations[selected_index].correctLocation.lng = draftLng;
                }
                await refreshAll();
            } else {
                coordinateError = data?.error ?? 'An error occurred';
                console.log(coordinateError);
            }
        };
    }

    let panorama_container = $state();
    let map_container = $state();
    let leaflet_map: any = null;
    let L_instance: any = null;
    let correct_marker: any = null;

    let map_view = $state(true);
    function select_view(isMap) { map_view = isMap; }

    // MarzipanoPanorama Effect
    $effect(() => {
        if (panorama_container && image_url) {
            let cleanupFn;

            setupPanorama({
                container: panorama_container,
                imageUrl: image_url,
                difficulty: 'easy',
            }).then((destroy) => {
                cleanupFn = destroy;
            });

            return () => {
                if (cleanupFn) cleanupFn();
            };
        }
    });

    // Initialize the map on component mount
    onMount(() => {
        let mapCleanup;

        const startCenter = [correct_location.lat, correct_location.lng];

        setupLeafletMap({
            container: map_container,
            initialCenter: startCenter,
            initialZoom: 19,
            zoomControlPosition: 'bottomright',
            onMapReady: (map, L) => {
                leaflet_map = map;
                L_instance = L;
                const fs = $font_size;
                correct_marker = renderCorrectMarker(map, L, correct_location, fs);
            }
        }).then((res) => {
            if (res) mapCleanup = res.cleanup;
        });

        return () => {
            if (mapCleanup) mapCleanup();
        };
    });

    $effect(() => {
        const _index = selected_index;

        if (leaflet_map && L_instance && correct_location) {
            leaflet_map.setView([correct_location.lat, correct_location.lng], 20);
            
            if (correct_marker) {
                correct_marker.remove();
                correct_marker = null;
            }
            
            const fs = $font_size;
            correct_marker = renderCorrectMarker(leaflet_map, L_instance, correct_location, fs);
        }
    });

    $effect(() => {
        if (map_view && leaflet_map) { leaflet_map.invalidateSize(); }
    });

    $effect(() => {
        const _index = selected_index;
        
        isEditingDescription = false;
        isEditingLatLng = false;
        descriptionError = '';
        coordinateError = '';
    });
    
</script>

<div class="page" style={`--font-size: ${$font_size}px; --duck-art-shift: 0px;`}>
    <div class="page-background">
        <MainHeader home={() => goto('/')}/>
        <main class="answer-map">
            <div class="answer-map-or-pano">
                <div class="view-tabs" role="tablist" aria-label="Answer view">
                    <button type="button" role="tab" class="view-tab" class:active={map_view} aria-selected={map_view} onclick={() => select_view(true)}>
                        Map
                    </button>
                    <button type="button" role="tab" class="view-tab" class:active={!map_view} aria-selected={!map_view} onclick={() => select_view(false)}>
                        Image
                    </button>
                </div>
                <div bind:this={map_container} class="leaflet-map" class:hidden={!map_view}></div>
                <div bind:this={panorama_container} class="answer-pano" class:hidden={map_view}></div>
            </div>
            <div class="location-selector-card">
                <label for="location-select">Select Location</label>
                <select id="location-select" bind:value={selected_index} class="location-dropdown">
                    {#each locations as loc, index}
                        <option value={index}>
                            {loc.locationID ?? `Location ${index + 1}`}
                        </option>
                    {/each}
                </select>
            </div>
            <div class="answer-description-card">
                <div class="card-inner">
                    <h2>Information</h2>
                    {#if descriptionError}
                        <p class="error-message">{descriptionError}</p>
                    {/if}
                    {#if isEditingDescription}
                    <form method="POST" action="/api/db/update/description" use:enhance={handle_description_update} class="description-update-form">
                        <input type="hidden" name="locationID" value={current_location?.locationID} />
                        <textarea name="newDescription" bind:value={newDescription} disabled={isSavingUpdate} class="description-input-form input-box"></textarea>
                        <button type="submit" class="description-edit-info-button" disabled={isSavingUpdate} aria-label="Save Description">✔</button>
                        <button type="button" class="description-cancel-edit-button" onclick={cancel_editing_description} disabled={isSavingUpdate} aria-label="Cancel Editing">✖</button>
                    </form>
                    {:else}                            
                        <span class="description-value">{description}</span>
                        <button class="description-edit-button" onclick={start_editing_description} aria-label="Edit Description">
                            ✎
                        </button>
                    {/if}
                </div>
            </div>
            <div class="answer-leaderboard-card">
                <div class="card-inner leaderboard-content">
                    <h2>Coordinates</h2>
                    {#if coordinateError}
                        <p class="error-message">{coordinateError}</p>
                    {/if}
                    {#if isEditingLatLng}
                        <form method="POST" action="/api/db/update/coordinates" use:enhance={handle_coordinates_update} class="coordinates-update-form">
                            <input type="hidden" name="locationID" value={current_location?.locationID} />
                            <input type="hidden" name="newLat" value={draftLat} />
                            <input type="hidden" name="newLng" value={draftLng} />

                            <!-- <p class="edit-instruction">Click map or drag pin:</p> -->
                            <div style="font-size: calc(var(--font-size)*1.5);">
                                <p>LATITUDE: {draftLat}</p>
                                <p>LONGITUDE: {draftLng}</p>
                            </div>

                            <button type="submit" class="coordinates-edit-info-button" disabled={isSavingUpdate} aria-label="Save Coordinates">✔</button>
                            <button type="button" class="coordinates-cancel-edit-button" onclick={cancel_editing_coordinates} disabled={isSavingUpdate} aria-label="Cancel Editing">✖</button>
                        </form>
                    {:else}
                        <div style="font-size: calc(var(--font-size)*1.5);">
                            <p>LATITUDE: {correct_location.lat}</p>
                            <p>LONGITUDE: {correct_location.lng}</p>
                        </div>
                        <button class="coordinates-edit-button" onclick={start_editing_coordinates} aria-label="Edit Coordinates">
                            ✎
                        </button>
                    {/if}
                </div>
            </div>
        </main>
    </div>
</div>

<style>
    .location-selector-card {
        position: absolute;
        top: calc(var(--font-size) * 0.5);
        right: calc(var(--font-size) * 1.5);
        width: calc(var(--font-size) * 20);
        box-sizing: border-box;
        background: #003566;
        border: 2px solid #557899;
        border-radius: 6px;
        padding: calc(var(--font-size) * 1) calc(var(--font-size) * 1.5);
        z-index: 10;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
        display: flex;
        flex-direction: column;
        gap: calc(var(--font-size) * 0.125);
    }

    .location-selector-card label {
        color: #FFC300;
        font-family: "Actor", sans-serif;
        font-size: calc(var(--font-size) * 1.1);
        font-weight: 700;
        text-align: center;
    }

    .location-dropdown {
        width: 100%;
        height: calc(var(--font-size) * 2.5);
        background: #001D3D;
        color: #ffffff;
        border: 2px solid #DC562E;
        border-radius: 6px;
        padding: 0 calc(var(--font-size) * 0.75);
        font-family: "Actor", sans-serif;
        font-size: calc(var(--font-size) * 1);
        cursor: pointer;
        outline: none;
        transition: border-color 0.2s ease, background-color 0.2s ease;
    }

    .location-dropdown:hover,
    .location-dropdown:focus {
        background: #002952;
        border-color: #FFC300;
    }

    .location-dropdown option {
        background: #001D3D;
        color: #ffffff;
    }

    .answer-description-card {
        top: calc(var(--font-size) * 7);
        height: calc(100% - var(--font-size) * 18);
        padding: 20px;
    }

    .answer-leaderboard-card {
        height: calc(var(--font-size) * 10);
        color: #ffffff;
        padding: 20px;
    }

    .card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: calc(var(--font-size) * 0.4) calc(var(--font-size) * 0.6);
    }

    .card-inner h2 {
        margin: 0 0 calc(var(--font-size) * 0.25) 0;
    }

    .leaderboard-content {
        gap: calc(var(--font-size) * 0.1);
    }

    .leaderboard-content p {
        margin: 10px;
    }

    .description-value {
        flex: 1;
        width: 100%;
        overflow-y: auto;
        white-space: normal;
        word-break: break-word;
        font-family: "Actor", sans-serif;
        font-size: calc(var(--font-size) * 1);
        color: #ffffff;
    }

    .description-update-form {
        display: flex;
        flex-direction: column;
        flex: 1;
        margin-top: calc(var(--font-size) * 0.25);
        gap: calc(var(--font-size) * 0.5);
        color: #ffffff;
    }

    .coordinates-update-form {
        display: flex;
        flex-direction: column;
        gap: calc(var(--font-size) * 0.25);
        color: #ffffff;
    }

    .description-input-form {
        flex: 1;
        width: 100%;
        resize: none;
        background: #001D3D;
        color: #ffffff;
        border: 2px solid #DC562E;
        border-radius: 6px;
        padding: calc(var(--font-size) * 0.5) calc(var(--font-size) * 0.75);
        font-family: "Actor", sans-serif;
        font-size: calc(var(--font-size) * 1);
        outline: none;
    }


    .description-input-form:focus {
        border-color: #FFC300;
    }

    .description-edit-button,
    .coordinates-edit-button,
    .description-edit-info-button,
    .coordinates-edit-info-button,
    .description-cancel-edit-button,
    .coordinates-cancel-edit-button {
        position: absolute;
        top: calc(var(--font-size) * 0.4);
        height: calc(var(--font-size) * 1.6);
        width: calc(var(--font-size) * 1.6);
        background: #001D3D;
        color: #ffffff;
        border: 2px solid #DC562E;
        border-radius: 4px;
        font-family: "Actor", sans-serif;
        font-size: calc(var(--font-size) * 0.8);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.2s ease, background-color 0.2s ease;
    }

    .description-edit-button,
    .coordinates-edit-button,
    .description-cancel-edit-button,
    .coordinates-cancel-edit-button {
        right: calc(var(--font-size) * 0.6);
    }

    .description-edit-info-button,
    .coordinates-edit-info-button {
        right: calc(var(--font-size) * 2.3);
    }

    .coordinates-edit-button:hover,
    .description-edit-button:hover,
    .coordinates-edit-info-button:hover,
    .coordinates-cancel-edit-button:hover,
    .description-edit-info-button:hover,
    .description-cancel-edit-button:hover {
        background: #002952;
        border-color: #FFC300;
    }
</style>