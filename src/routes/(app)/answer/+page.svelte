<script>
    import { goto } from '$app/navigation';
    import { font_size, selected_difficulty } from '$lib/stores/settings';
    import { onMount, untrack } from 'svelte';
    import { get } from 'svelte/store';
    import { page } from '$app/state';

    let leaflet_loaded = false;
    let map_container;
    let leaflet_map;

    let guessed_marker;
    let correct_marker;
    let answer_line;
    let leaderboard_markers = [];

    let guessed_location = { lat: 38.9358, lng: -92.3331 };
    let correct_location = { lat: 38.9361, lng: -92.3255 };

    const players = [
        { name: 'Username0', score: 100000, lat: 38.9364, lng: -92.3262 },
        { name: 'Username1', score: 100000, lat: 38.9370, lng: -92.3280 },
        { name: 'Username2', score: 100000, lat: 38.9349, lng: -92.3243 },
        { name: 'Username3', score: 100000, lat: 38.9372, lng: -92.3300 },
        { name: 'Username4', score: 100000, lat: 38.9341, lng: -92.3275 }
    ];

    function escape_html(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

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

    onMount(() => {
        if (typeof window !== 'undefined' && window.L) {
            leaflet_loaded = true;
            return;
        }

        const css_link = document.createElement('link');
        css_link.rel = 'stylesheet';
        css_link.href =
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(css_link);

        const script = document.createElement('script');
        script.src =
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

        script.onload = () => {
            leaflet_loaded = true;
        };

        document.head.appendChild(script);
    });

    $effect(() => {
        if (!leaflet_loaded || !map_container || leaflet_map) return;

        const L = window.L;
        const fs = get(font_size);

        const username = escape_html(
            untrack(() => {
                const user = page.data?.user ?? page.data?.session?.user;
                if (!user || user.is_anonymous) return 'Guest';
                return user.user_metadata?.display_name ?? 'User';
            })
        );

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
                <span class="map-marker-label map-marker-label--correct">Actual</span>
            `,
            iconSize: [pin_w, pin_h + label_h],
            iconAnchor: [pin_w / 2, pin_h * (37 / 38)]
        });

        const guess = [
            guessed_location.lat,
            guessed_location.lng
        ];

        const answer = [
            correct_location.lat,
            correct_location.lng
        ];

        const leaderboardIcon = (rank) =>
            L.divIcon({
                className: 'map-marker',
                html: `<img class="map-marker-img" src="/mascot.png" alt="" />
                       <span class="map-marker-label map-marker-label--rank"><span class="map-marker-rank-num">${rank}</span></span>`,
                iconSize: [fs * 2, fs * 2 + label_h],
                iconAnchor: [fs, fs]
            });

        leaderboard_markers = players.map((player, i) =>
            L.marker([player.lat, player.lng], {
                icon: leaderboardIcon(i + 1),
                keyboard: false
            }).addTo(leaflet_map)
        );

        guessed_marker = L.marker(guess, {
            icon: guessIcon,
            keyboard: false,
            zIndexOffset: 1000
        }).addTo(leaflet_map);

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

        answer_line = L.polyline([guess, answer], {
            color: '#ffc300',
            weight: 3,
            opacity: 1,
            dashArray: '8, 8'
        }).addTo(leaflet_map);

        leaflet_map.fitBounds(
            L.latLngBounds([guess, answer, ...players.map((p) => [p.lat, p.lng])]),
            {
                paddingTopLeft: [fs * 21, fs * 4],
                paddingBottomRight: [fs * 19, fs * 6],
                maxZoom: 18
            }
        );

        const resizeObserver = new ResizeObserver(() => {
            leaflet_map?.invalidateSize();
        });

        resizeObserver.observe(map_container);

        return () => {
            resizeObserver.disconnect();
            leaflet_map?.remove();
            leaflet_map = undefined;
            leaderboard_markers = [];
        };
    });
</script>

<div class="page answer-page" style={`--font-size: ${$font_size}px`}>
    <div class="page-background">
        <main class="answer-map">
            <div bind:this={map_container} class="leaflet-map"></div>
            <aside class="answer-description-card">
                <h2>Information</h2>
                <p>
                    description here. resources. fun facts. #awesome
                </p>
            </aside>
            <aside class="answer-leaderboard-card">
                <div class="leaderboard-content">
                    <h2>Leaderboard</h2>
                    <div class="leaderboard-players">
                        {#each players as player, i}
                            <div class="leaderboard-player">
                                <div class="leaderboard-player-info">
                                    <span class="leaderboard-player-rank">{i + 1}</span>
                                    <span class="leaderboard-player-name">{player.name}</span>
                                </div>
                                <span class="leaderboard-player-score">{player.score}</span>
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
                    <span class="answer-round-stat-value">1000 <span class="answer-round-stat-unit">m</span></span>
                </div>
                <span class="answer-round-stat-separator">|</span>
                <div class="answer-round-stat time-stat">
                    <span class="answer-round-stat-label">Time</span>
                    <span class="answer-round-stat-value">2:30 <span class="answer-round-stat-unit">min</span></span>
                </div>
                <span class="answer-round-stat-separator">|</span>
                <div class="answer-round-stat difficulty-stat">
                    <span class="answer-round-stat-label">Difficulty</span>
                    <span class="answer-round-stat-value difficulty-stat">MEDIUM</span>
                </div>
            </div>
            <div class="answer-round-score">
                <span class="answer-round-stat-label">Score</span>
                <span class="answer-round-stat-value">4758</span>
            </div>
            <button type="button" class="home-button" onclick={() => goto('/end')}>
                Next
            </button>
        </aside>
    </div>
</div>