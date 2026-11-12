<script>
    import { modal, Quit } from '$lib/modals'
    import { goto } from '$app/navigation';
    import { font_size } from '$lib/stores/settings';
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { MainHeader } from '$lib/shared/headers';
    import { roundResult, currentLocIdx, sessionScore } from '$lib/stores/game';
    import { setupLeafletMap, renderUserGuessMarker, renderCorrectMarker, renderLeaderboardMarkers } from '$lib/shared/scripts';

    // let leaflet_loaded = false;
    let map_container;
    let leaflet_map = $state(null);
    let L_instance = null;

    let guessed_marker;
    let correct_marker;
    let answer_line;
    let leaderboard_markers = [];
    let leaderboard_lines = [];

    let roundData = $roundResult.roundResult;
    let is_valid_guess = $derived((roundData?.guessedLocation?.lat >= -90) && (roundData?.guessedLocation?.lat <= 90));
    let guessed_location = roundData?.guessedLocation ?? { lat: 0, lng: 0 };
    let correct_location = $roundResult?.correctLocation ?? { lat: 38.9353, lng: -92.3300 };

    let userdata = page.data?.userdata ?? {};
    let user_name = userdata.username ?? 'Guest';
    let players = $state([]);

    async function getLeaderboard() {
        try {
            const id = roundData?.locationId ?? 0;

            const response = await fetch('/api/game/leaderboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ locationId: id, userGuess: $roundResult.roundResult, user: user_name })
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

    onMount(() => getLeaderboard());

    onMount(() => {
        let mapCleanup;

        setupLeafletMap({
            container: map_container,
            initialCenter: [correct_location.lat, correct_location.lng],
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
        if(!leaflet_map || !L_instance || !is_valid_guess) return;
        const fs = $font_size;

        if (guessed_marker) { guessed_marker.remove(); guessed_marker = null; }
        if (answer_line) { answer_line.remove(); answer_line = null; }

        const user_rank = players.findIndex(p => p?.isCurrGuess === true);
        const rendered = renderUserGuessMarker(
            leaflet_map, 
            L_instance, 
            guessed_location, 
            correct_location.lat,
            correct_location.lng,
            user_name,
            user_rank,
            fs,
        );

        guessed_marker = rendered.marker;
        answer_line = rendered.line;
    });

    $effect(() => {
        if(!leaflet_map || !L_instance || !players || players.length === 0) return;
        const fs = $font_size;

        leaderboard_markers.forEach(marker => marker.remove());
        leaderboard_lines.forEach(line => line.remove());

        const rendered = renderLeaderboardMarkers(
            leaflet_map,
            L_instance,
            players,
            correct_location.lat,
            correct_location.lng,
            guessed_location,
            is_valid_guess,
            fs
        );

        leaderboard_markers = rendered.markers;
        leaderboard_lines = rendered.lines;
    });

    let description = $roundResult?.description ?? 'No description available.';
    let guessed_distance = roundData?.distance ? Math.floor(roundData?.distance) : '∞';
    let guessed_time_formatted = roundData?.seconds ? `${Math.floor(roundData.seconds / 60)}:${String(roundData.seconds % 60).padStart(2, '0')}` : "0:00";
    let round_score = roundData?.score ?? 0;
    let difficulty = roundData?.difficulty;
    
    const max_scores = {
        easy: 3000,
        medium: 4000,
        hard: 5000
    };

    let max_score = $derived(max_scores[difficulty]);

    function nextRound() {
        $sessionScore += round_score;
        document.cookie = "can_play=true; path=/; SameSite=Strict";
        goto('/game/play')
    }

    function goToEnd() {
        $sessionScore += round_score;
        document.cookie = "game_played=true; path=/; SameSite=Strict";
        goto('/game/end');
    }
</script>

<div class="page" style={`--font-size: ${$font_size}px; --duck-art-shift: 0px;`}>
    <div class="page-background">
        <MainHeader isAnswer={true} home={() => modal.open(Quit)}/>
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
                            <div class="leaderboard-player" class:empty={!player} class:is-current-user={player?.isCurrGuess}>
                                <div class="leaderboard-player-info">
                                    <span class="leaderboard-player-rank">{i + 1}</span>
                                    {#if player}
                                        <span class="leaderboard-player-name">{player.username}</span>
                                    {:else}
                                        <span class="leaderboard-player-name placeholder">—</span>
                                    {/if}
                                </div>
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
                    <span class="answer-round-stat-label">Distance:</span>
                    <span class="answer-round-stat-value">{guessed_distance} m</span>
                </div>
                <span class="answer-round-stat-separator">|</span>
                <div class="answer-round-stat time-stat">
                    <span class="answer-round-stat-label">Time:</span>
                    <span class="answer-round-stat-value">{guessed_time_formatted} <span class="answer-round-stat-unit">min</span></span>
                </div>
                <span class="answer-round-stat-separator">|</span>
                <div class="answer-round-stat difficulty-stat">
                    <span class="answer-round-stat-label">Difficulty:</span>
                    <span class="difficulty-badge difficulty-{difficulty}">{difficulty}</span>
                </div>
            </div>
            <div class="answer-round-score">
                <span class="answer-round-stat-label">Score:</span>
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
