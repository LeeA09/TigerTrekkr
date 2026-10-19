<script>
    import { goto } from '$app/navigation';
    import { font_size } from '$lib/stores/settings';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { page } from '$app/state';
    import { roundResult, currentLocIdx, selected_difficulty } from '$lib/stores/game';

    let leaflet_loaded = false;
    let map_container;
    let leaflet_map = $state(null);

    let guessed_marker;
    let correct_marker;
    let answer_line;
    let leaderboard_markers = [];

    let is_valid_guess = $derived(($roundResult?.guessedLocation?.lat >= -90) && ($roundResult?.guessedLocation?.lat <= 90));
    let guessed_location = $roundResult?.guessedLocation ?? { lat: 0, lng: 0 };
    let correct_location = $roundResult?.correctLocation ?? { lat: 38.9353, lng: -92.3300 };

    let userdata = page.data?.userdata ?? {};
    let user_name = userdata.username ?? 'Guest';

    async function getLeaderboard() {
        try {
            const id = $roundResult?.locationId ?? 0;

            const response = await fetch('/api/game/location-leaderboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    locationId: id,
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

    function measure_mascot_shift(root) {
        const img = new Image();
        img.onload = () => {
            try {
                const w = img.naturalWidth;
                const h = img.naturalHeight;
                if (!w || !h) return;
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(img, 0, 0);
                const { data } = ctx.getImageData(0, 0, w, h);

                let min_x = w;
                let max_x = -1;
                for (let y = 0; y < h; y++) {
                    for (let x = 0; x < w; x++) {
                        if (data[(y * w + x) * 4 + 3] > 24) {
                            if (x < min_x) min_x = x;
                            if (x > max_x) max_x = x;
                        }
                    }
                }
                if (max_x < min_x) return;

                const shift = (min_x + max_x + 1) / 2 / w - 0.5;
                root?.style.setProperty('--duck-art-shift', shift.toFixed(4));
            } catch {
            }
        };
        img.src = '/mascot.png';
    }

    function center_rank_numbers(root) {
        if (!root) return;
        const ctx = document.createElement('canvas').getContext('2d');

        root.querySelectorAll('.map-marker-rank-num').forEach((num) => {
            const label = num.parentElement;
            const style = getComputedStyle(num);
            ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
            const m = ctx.measureText(num.textContent);

            const line_h = parseFloat(style.fontSize);
            const asc = m.fontBoundingBoxAscent;
            const desc = m.fontBoundingBoxDescent;
            if (!asc && !desc) return;

            const baseline =
                (label.clientHeight - line_h) / 2 + (line_h - (asc + desc)) / 2 + asc;
            const ink_center_y =
                baseline - (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
            const dy = label.clientHeight / 2 - ink_center_y;

            const dx = (m.width - m.actualBoundingBoxRight + m.actualBoundingBoxLeft) / 2;

            num.style.transform = `translate(${dx}px, ${dy}px)`;
        });
    }

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

    onMount(() => {
        function cleanup() {
            if (leaflet_map) {
                leaflet_map.remove();
                leaflet_map = null;
            }
        }
        
        void (async () => {
            try {
                const L = await loadLeaflet();
                if (!map_container || !L) return;

                const fs = get(font_size);
                const username = user_name;

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

                const label_h = fs * 1.5;

                const guessIcon = L.divIcon({
                    className: 'map-marker',
                    html: `<img class="map-marker-img" src="/mascot.png" alt="" />
                           <span class="map-marker-label map-marker-label--you">${username}</span>`,
                    iconSize: [fs * 2, fs * 2 + label_h],
                    iconAnchor: [fs, fs]
                });

                const pin_w = fs * 1.75;
                const pin_h = fs * 2.375;
                const pinIcon = L.divIcon({
                    className: 'map-marker',
                    html: `
                        <svg class="map-marker-pin" width="${pin_w}" height="${pin_h}" viewBox="0 0 28 38"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 37 C11 29 2 20 2 13
                                A12 12 0 1 1 26 13 C26 20 17 29 14 37Z"
                                fill="#ffc300" stroke="#ffc300"/>
                            <circle cx="14" cy="13" r="4.5" fill="#ffffff"/>
                        </svg>
                    `,
                    // <span class="map-marker-label map-marker-label--correct">Answer</span>
                    iconSize: [pin_w, pin_h + label_h],
                    iconAnchor: [pin_w / 2, pin_h * (37 / 38)]
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

                    answer_line = L.polyline([guess, answer], {
                        color: '#ffc300',
                        weight: 3,
                        opacity: 1,
                        dashArray: '8, 8'
                    }).addTo(leaflet_map);
                }

                correct_marker = L.marker(answer, {
                    icon: pinIcon,
                    keyboard: false,
                    zIndexOffset: 500
                }).addTo(leaflet_map);

                measure_mascot_shift(map_container);
                center_rank_numbers(map_container);

                document.fonts
                    ?.load(`700 ${fs}px "Actor"`, '12345')
                    .catch(() => {})
                    .then(() => {
                        if (leaflet_map) center_rank_numbers(map_container);
                    });

                const resizeObserver = new ResizeObserver(() => {
                    leaflet_map?.invalidateSize();
                });

                resizeObserver.observe(map_container);

                cleanup = () => {
                    resizeObserver.disconnect();
                    leaflet_map?.remove();
                    leaflet_map = undefined;
                    leaderboard_markers = [];
                };
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
        const fs = get(font_size);
        const label_h = fs * 1.5;

        leaderboard_markers.forEach((marker) => {
            marker.remove();
        });
        leaderboard_markers = [];

        const validPlayers = players.filter(Boolean);

        const leaderboardIcon = (rank) =>
            L.divIcon({
                className: 'map-marker',
                // MODIFY OPACITY OF LEADERBOARD MARKERS HERE
                html: `<img class="map-marker-img" style="opacity: 0.7;" src="/mascot.png" alt="" />
                       <span class="map-marker-label map-marker-label--rank"><span class="map-marker-rank-num">${rank}</span></span>`,
                iconSize: [fs * 2, fs * 2 + label_h],
                iconAnchor: [fs, fs]
            });

        leaderboard_markers = validPlayers.map((player, i) =>
            L.marker([player.lat, player.lng], {
                icon: leaderboardIcon(i + 1),
                keyboard: false
            }).addTo(leaflet_map)
        );

        const answer = [
            correct_location.lat,
            correct_location.lng
        ];

        const boundsPoints = [answer, ...validPlayers.map((p) => [p.lat, p.lng])];

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

    function nextRound() {
        $currentLocIdx++;
        document.cookie = "can_play=true; path=/; SameSite=Strict";
        goto('/play')
    }

    function goToEnd() {
        currentLocIdx.set(0);
        document.cookie = "game_played=true; path=/; SameSite=Strict";
        goto('/end');
    }
</script>

<div class="page answer-page" style={`--font-size: ${$font_size}px`}>
    <div class="page-background">
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
                                {#if player}
                                    <span class="leaderboard-player-score">{player.score}</span>
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
            {#if $currentLocIdx < 2}
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
