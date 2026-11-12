let leafletScriptPromise = null;

function loadLeaflet() {
    if (typeof window === 'undefined') return Promise.reject('SSR not supported');
    if (window.L) return Promise.resolve(window.L);
    if (leafletScriptPromise) return leafletScriptPromise;

    leafletScriptPromise = new Promise((resolve, reject) => {
        const css_link = document.createElement('link');
        css_link.rel = 'stylesheet';
        css_link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(css_link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => resolve(window.L);
        script.onerror = (err) => {
            leafletScriptPromise = null;
            reject(err);
        };
        document.head.appendChild(script);
    });

    return leafletScriptPromise;
}

export async function setupLeafletMap({ 
    container, 
    onMapClick,
    initialCenter = [38.9453, -92.3288],
    initialZoom = 16,
    zoomControlPosition = 'topright',
    onMapReady
}) {
    if (!container) return () => {};

    try {
        const L = await loadLeaflet();
        if (!container.isConnected) return () => {};

        // Define Mizzou campus boundary
        const mizzouBounds = L.latLngBounds(
            [38.949697, -92.314951], // Southwest corner
            [38.927023, -92.346998]  // Northeast corner
        );

        const map = L.map(container, {
            zoomControl: false,
            attributionControl: true,
            fadeAnimation: false,
            maxBounds: mizzouBounds,
            maxBoundsViscosity: 1.0,
            minZoom: 15
        }).setView(initialCenter, initialZoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            minZoom: 15,
            keepBuffer: 8,
            updateWhenIdle: false,
            updateWhenZooming: false,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        L.control.zoom({ position: zoomControlPosition }).addTo(map);

        if (onMapClick) {
            let guessMarker = null;
            const duckIcon = L.icon({
                iconUrl: '/mascot.png',
                iconSize: [20, 20],
                iconAnchor: [10, 10],
                popupAnchor: [0, -20]
            });

            map.on('click', (e) => {
                if (guessMarker) {
                    guessMarker.setLatLng(e.latlng);
                } else {
                    guessMarker = L.marker(e.latlng, { icon: duckIcon }).addTo(map);
                }
                onMapClick(e.latlng);
            });
        }

        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
        });
        resizeObserver.observe(container);

        if (onMapReady) {
            onMapReady(map, L);
        }

        // Return an object containing the map instance and cleanup function
        return {
            map,
            cleanup: () => {
                resizeObserver.disconnect();
                map.remove();
            }
        };
    } catch (err) {
        console.error('Failed to load Leaflet:', err);
        return null;
    }
}

export function renderUserGuessMarker(map, L, { lat, lng }, correctLat, correctLng, userName, userRank, fontSize, iconUrl = '/mascot.png') {
    const hasRank = userRank !== -1;
    const rankDisplay = hasRank
        ? `<span class="map-marker-label--rank"><span class="map-marker-rank-num">${userRank + 1}</span></span>`
        : '';

    const usernameWidth = userName.length * (fontSize * 0.5);
    const basePadding = fontSize * 2;
    const rankWidth = hasRank ? (fontSize * 1.5 + 6) : 0;
    const totalWidth = usernameWidth + basePadding + rankWidth;
    const totalHeight = fontSize * 1.75;

    const guessIcon = L.divIcon({
        className: 'map-marker',
        html: `<div class="map-marker-wrapper">
                    <img class="map-marker-img" src="${iconUrl}" alt="" />
                    <span class="map-marker-label map-marker-label--you">
                        ${rankDisplay}
                        <span class="map-marker-username">${userName}</span>
                    </span>
                </div>`,
        iconAnchor: [totalWidth / 16, totalHeight]
    });

    const guessCoords = [lat, lng];
    const correctCoords = [correctLat, correctLng];

    const marker = L.marker(guessCoords, {
        icon: guessIcon,
        keyboard: false,
        zIndexOffset: 1000
    }).addTo(map);

    const line = L.polyline([guessCoords, correctCoords], {
        color: '#ffc300',
        weight: 3,
        opacity: 1,
        dashArray: '8, 8'
    }).addTo(map);

    return { marker, line };
}

export function renderCorrectMarker(map, L, { lat, lng }, fontSize) {
    const pin_w = fontSize * 1.75;
    const pin_h = fontSize * 2.375;
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
        iconAnchor: [pin_w / 2, pin_h * (37 / 38)]
    });

    return L.marker([lat, lng], {
        icon: pinIcon,
        keyboard: false,
        zIndexOffset: 500
    }).addTo(map);
}

export function renderLeaderboardMarkers(map, L, players, correctLat, correctLng, guessedLocation, isValidGuess, fontSize) {
    const markers = [];
    const lines = [];

    const filteredPlayers = players
        .map((player, index) => ({ player, rank: index + 1 }))
        .filter(({ player }) => player && !player.isCurrGuess);

    const leaderboardIcon = (rank) =>
        L.divIcon({
            className: 'map-marker',
            html: `<div class="map-marker-wrapper">
                        <span class="map-marker-label map-marker-label--rank">
                            <span class="map-marker-rank-num">${rank}</span>
                        </span>
                    </div>`,
            iconAnchor: [fontSize * 0.75, fontSize * 0.75]
        });

    const answer = [correctLat, correctLng];

    filteredPlayers.forEach(({ player, rank }) => {
        const playerLatLng = [player.lat, player.lng];

        const marker = L.marker(playerLatLng, {
            icon: leaderboardIcon(rank),
            keyboard: false
        }).addTo(map);

        const line = L.polyline([playerLatLng, answer], {
            color: '#003566',
            weight: 2,
            opacity: 0.7,
            dashArray: '6, 6'
        }).addTo(map);

        markers.push(marker);
        lines.push(line);
    });

    const boundsPoints = [answer, ...filteredPlayers.map((p) => [p.player.lat, p.player.lng])];

    if (isValidGuess && guessedLocation) {
        boundsPoints.push([guessedLocation.lat, guessedLocation.lng]);
    }

    map.fitBounds(
        L.latLngBounds(boundsPoints),
        {
            paddingTopLeft: [fontSize * 21, fontSize * 4],
            paddingBottomRight: [fontSize * 19, fontSize * 6],
            maxZoom: 18
        }
    );

    return { markers, lines };
}