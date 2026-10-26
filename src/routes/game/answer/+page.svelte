<script>
    import { goto } from '$app/navigation';
    import { font_size } from '$lib/stores/settings';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { page } from '$app/state';
    import { MainHeader } from '$lib/shared/headers';
    import { roundResult, currentLocIdx, selected_difficulty, sessionScore } from '$lib/stores/game';

    let leaflet_loaded = false;
    let map_container;
    let leaflet_map = $state(null);

    let guessed_marker;
    let correct_marker;
    let answer_line;
    let leaderboard_markers = [];
    let leaderboard_lines = [];

    let is_valid_guess = $derived(($roundResult?.guessedLocation?.lat >= -90) && ($roundResult?.guessedLocation?.lat <= 90));
    let guessed_location = $roundResult?.guessedLocation ?? { lat: 0, lng: 0 };
    let correct_location = $roundResult?.correctLocation ?? { lat: 38.9353, lng: -92.3300 };

    let userdata = page.data?.userdata ?? {};
    let user_name = userdata.username ?? 'Guest';

    async function getLeaderboard() {
        try {
            const id = $roundResult?.locationId ?? 0;
            const currRoundId = $roundResult?.roundId;

            const response = await fetch('/api/game/location-leaderboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    locationId: id,
                    roundId: currRoundId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            players = Array.from({ length: 3 }, (_, i) => data?.leaderboard?.[i] || null);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    }

    onMount(() => {
        getLeaderboard();
    });

    let players = $state([]);
    let user_rank = $state(-1);

    let description = $roundResult?.description ?? 'No description available.';
    let guessed_distance = $roundResult?.distance ?? '∞';
    let guessed_time_formatted = $roundResult?.seconds ? `${Math.floor($roundResult.seconds / 60)}:${String($roundResult.seconds % 60).padStart(2, '0')}` : "0:00";
    let round_score = $roundResult?.score ?? 0;
    
    const max_scores = {
        easy: 3000,
        medium: 4000,
        hard: 5000
    };

    let max_score = $derived(max_scores[$selected_difficulty]);

    function loadLeaflet() {
        if (typeof window !== 'undefined' && window.L) {
            leaflet_loaded = true;
            return window.L;
        }

        return new Promise((resolve, reject) => {
            if(!document.querySelector('link[href*="leaflet.css"]')) {
                const css_link = document.createElement('link');
                css_link.rel = 'stylesheet';
                css_link.href =
                    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(css_link);
            }

            const script = document.createElement('script');
            script.src =
                'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => {
                leaflet_loaded = true;
                resolve(window.L);
            };
            script.onerror = () => {
                reject(new Error('Failed to load Leaflet'));
            };
            document.head.appendChild(script);
        })
    }

    $effect(() => {
        if(!leaflet_map || !window.L) return;
        const L = window.L;
        const fs = $derived($font_size)

        if (guessed_marker) { guessed_marker.remove(); guessed_marker = null; }
        
        user_rank = players.findIndex(p => p?.isCurrGuess === true);
        const hasRank = user_rank !== -1;
        const rankDisplay = hasRank
            ? `<span class="map-marker-label--rank"><span class="map-marker-rank-num">${user_rank + 1}</span></span>`
            : '';

        const usernameWidth = user_name.length * (fs * 0.5)
        const basePadding = fs * 2
        const rankWidth = hasRank ? (fs * 1.5 + 6) : 0; // Rank badge width plus padding gap

        const totalWidth = usernameWidth + basePadding + rankWidth;
        const totalHeight = fs * 1.75;

        const guessIcon = L.divIcon({
            className: 'map-marker',
            html:  `<div class="map-marker-wrapper">
                        <img class="map-marker-img" src="/mascot.png" alt="" />
                        <span class="map-marker-label map-marker-label--you">
                            ${rankDisplay}
                            <span class="map-marker-username">${user_name}</span>
                        </span>
                    </div>`,
            iconAnchor: [totalWidth / 16, totalHeight]
        });

        const answer = [
            correct_location.lat,
            correct_location.lng
        ];

        // IF SUBMITTED ANSWER WAS BECAUSE OF A TIMER RUNOUT
        if(is_valid_guess){
            const guess = [
                guessed_location.lat,
                guessed_location.lng
            ];

            guessed_marker = L.marker(guess, {
                icon: guessIcon,
                keyboard: false,
                zIndexOffset: 1000
            }).addTo(leaflet_map);

            if(answer_line){ answer_line.remove() }

            answer_line = L.polyline([guess, answer], {
                color: '#ffc300',
                weight: 3,
                opacity: 1,
                dashArray: '8, 8'
            }).addTo(leaflet_map);
        }
    })

    onMount(() => {
        function cleanup() {
            const resizeObserver = new ResizeObserver(() => {
                leaflet_map?.invalidateSize();
            });
            resizeObserver.disconnect();
            leaflet_map?.remove();
            leaflet_map = null;
            leaderboard_markers = [];
            leaderboard_lines = [];
        }
        
        void (async () => {
            try {
                const L = await loadLeaflet();
                if (!map_container || !L) return;

                const fs = get(font_size);

                const mizzouBounds = L.latLngBounds(
                    [38.949697, -92.314951],
                    [38.927023, -92.346998]
                );

                leaflet_map = L.map(map_container, {
                    zoomControl: false,
                    attributionControl: true,
                    fadeAnimation: false,
                    maxBounds: mizzouBounds,
                    maxBoundsViscosity: 1.0,
                    minZoom: 15
                }).setView([38.9353, -92.3300], 16);

                L.tileLayer(
                    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {
                        maxZoom: 19,
                        minZoom: 15,
                        keepBuffer: 8,
                        updateWhenIdle: false,
                        updateWhenZooming: false,
                        attribution: '&copy; OpenStreetMap contributors'
                    }
                ).addTo(leaflet_map);

                L.control.zoom({ position: 'bottomright' }).addTo(leaflet_map);

                const pin_w = fs * 1.75;
                const pin_h = fs * 2.375;
                const pinIcon = L.divIcon({
                    className: 'map-marker',
                    html: `
                        <svg class="map-marker-pin" width="${pin_w}" height="${pin_h}" viewBox="0 0 28 38"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 37 C11 29 2 20 2 13
                                A12 12 0 1 1 26 13 C26 20 17 29 14 37Z"
                                fill="#ffc300" stroke="#001D3D" stroke-width="0.5"/>
                            <circle cx="14" cy="13" r="4.5" fill="#001D3D"/>
                        </svg>
                    `,
                    //iconSize: [pin_w, pin_h + label_h],
                    iconAnchor: [pin_w / 2, pin_h * (37 / 38)]
                });

                const answer = [
                    correct_location.lat,
                    correct_location.lng
                ];

                correct_marker = L.marker(answer, {
                    icon: pinIcon,
                    keyboard: false,
                    zIndexOffset: 500
                }).addTo(leaflet_map);

                document.fonts
                    ?.load(`700 ${fs}px "Actor"`, '12345')
                    .catch(() => {})

                const resizeObserver = new ResizeObserver(() => {
                    leaflet_map?.invalidateSize();
                });

                resizeObserver.observe(map_container);
            } catch (error) {
                console.error('Error loading Leaflet:', error);
            }
        })();

        return () => {
            cleanup?.();
        };
    });

    $effect(() => {
        if(!leaflet_map || !window.L || !players || players.length === 0) return;
        const L = window.L;
        const fs = $derived($font_size);

        leaderboard_markers.forEach((marker) => { marker.remove(); });
        leaderboard_markers = [];

        leaderboard_lines.forEach((line) => { line.remove(); });
        leaderboard_lines = [];

        const filteredPlayers = players
            .map((player, index) => ({ player, rank: index + 1 }))
            .filter(({ player }) => 
                player && 
                !player.isCurrGuess
            );

        // MODIFY OPACITY OF LEADERBOARD MARKERS HERE
        // <img class="map-marker-img" style="opacity: 0.7;" src="/mascot.png" alt="" />
        const leaderboardIcon = (rank) =>
            L.divIcon({
                className: 'map-marker',
                html:  `<div class="map-marker-wrapper">
                            <span class="map-marker-label map-marker-label--rank">
                                <span class="map-marker-rank-num">${rank}</span>
                            </span>
                        </div>`,
                iconAnchor: [fs * 0.75, fs * 0.75]
            });

        const answer = [
            correct_location.lat,
            correct_location.lng
        ];

        leaderboard_markers = filteredPlayers.map((player) => {
            const playerLatLng = [player.player.lat, player.player.lng];
            
            const marker = L.marker(playerLatLng, {
                icon: leaderboardIcon(player.rank),
                keyboard: false
            }).addTo(leaflet_map);

            const line = L.polyline([playerLatLng, answer], {
                color: '#003566',
                weight: 2,
                opacity: 0.7,
                dashArray: '6, 6'
            }).addTo(leaflet_map);

            leaderboard_lines.push(line);

            return marker;
        });

        const boundsPoints = [answer, ...filteredPlayers.map((p) => [p.player.lat, p.player.lng])];

        if(is_valid_guess){
            const guess = [
                guessed_location.lat,
                guessed_location.lng
            ];

            boundsPoints.push(guess)
        }

        leaflet_map.fitBounds(
            L.latLngBounds(boundsPoints),
            {
                paddingTopLeft: [fs * 21, fs * 4],
                paddingBottomRight: [fs * 19, fs * 6],
                maxZoom: 18
            }
        );
    });

    function addScore() {
        $sessionScore += round_score;
    }

    function nextRound() {
        addScore()
        document.cookie = "can_play=true; path=/; SameSite=Strict";
        goto('/game/play')
    }

    function goToEnd() {
        addScore()
        document.cookie = "game_played=true; path=/; SameSite=Strict";
        goto('/game/end');
    }
</script>

<div class="page" style={`--font-size: ${$font_size}px; --duck-art-shift: 0px;`}>
    <div class="page-background">
        <MainHeader />
        <main class="answer-map">
            <div bind:this={map_container} class="leaflet-map"></div>
            <aside class="answer-description-card">
                <h2>Information</h2>
                <p>{description}</p>
            </aside>
            <aside class="answer-leaderboard-card">
                <div class="leaderboard-content">
                    <h2>Leaderboard</h2>
                    <div class="leaderboard-players">
                        {#each players as player, i}
                            <div class="leaderboard-player" class:empty={!player}>
                                <div class="leaderboard-player-info">
                                    <span class="leaderboard-player-rank">{i + 1}</span>
                                    {#if player}
                                        <span class="leaderboard-player-name">{player.username}</span>
                                    {:else}
                                        <span class="leaderboard-player-name placeholder">—</span>
                                    {/if}
                                </div>
                                <!-- {#if player}
                                    <span class="leaderboard-player-score">{player.score}</span>
                                {:else}
                                    <span class="leaderboard-player-score placeholder">—</span>
                                {/if} -->

                                {#if player}
                                    <span class="leaderboard-player-score">{player.distance} m</span>
                                {:else}
                                    <span class="leaderboard-player-score placeholder">—</span>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            </aside>
        </main>
        <aside class="answer-bot-bar">
            <div class="answer-stats-group">
                <div class="answer-round-stat distance-stat">
                    <span class="answer-round-stat-label">Distance</span>
                    <span class="answer-round-stat-value">{guessed_distance} m</span>
                </div>
                <span class="answer-round-stat-separator">|</span>
                <div class="answer-round-stat time-stat">
                    <span class="answer-round-stat-label">Time</span>
                    <span class="answer-round-stat-value">{guessed_time_formatted} <span class="answer-round-stat-unit">min</span></span>
                </div>
                <span class="answer-round-stat-separator">|</span>
                <div class="answer-round-stat difficulty-stat">
                    <span class="answer-round-stat-label">Difficulty</span>
                    <span class="difficulty-badge difficulty-{$selected_difficulty}">{$selected_difficulty}</span>
                </div>
            </div>
            <div class="answer-round-score">
                <span class="answer-round-stat-label">Score</span>
                <span class="answer-round-stat-value">{round_score} / {max_score}</span>
            </div>
            {#if $currentLocIdx < 3}
            <button type="button" class="home-button" onclick={nextRound}>
                Next Round
            </button>
            {:else}
            <button type="button" class="home-button" onclick={goToEnd}>
                End Game
            </button>
            {/if}
        </aside>
    </div>
</div>
