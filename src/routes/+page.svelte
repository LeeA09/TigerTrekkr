<script>

    import { goto } from '\$app/navigation';

    import { onMount } from 'svelte';

    // Animate the background in a figure-8 pattern
    onMount(() => {
        const background = document.querySelector('.background-animation');

        const duration = 80000;
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = (currentTime - startTime) % duration;
            const t = (elapsed / duration) * Math.PI * 2;

            const x = 12 * Math.sin(t);
            const y = 6 * Math.sin(2 * t);

            if (background) {
                background.style.transform = `scale(2) translate(${x}%, ${y}%)`;
            }

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    });
</script>

<div class="page">
    <main class="page-home">
        <div class="background-animation"></div>
        <div class="background-overlay"></div>
        <div class="home-center">
            <h1>TigerTrekkr</h1>
            <div class="button-main">
                <button class="home-button" onclick={() => goto('/login')}>Log in</button>
                <button class="home-button" onclick={() => goto('/signup')}>Sign up</button>
                <button class="home-button">Play as Guest</button>
            </div>
        </div>
        <div class="button-circle">
            <button class="utility-button" title="Settings" aria-label="Settings">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
            </button>
            <button class="utility-button" title="Help" aria-label="Help">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            </button>
            <button class="utility-button" title="Info" aria-label="Info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
            </button>
        </div>
    </main>
    <aside class="home-leaderboard">
        <h2>Leaderboard</h2>
        <div class="leaderboard-players">
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">1</span>
                    <span class="leaderboard-player-name">Username1</span>
                </div>
                <span class="leaderboard-player-score">100000</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">2</span>
                    <span class="leaderboard-player-name">Username1</span>
                </div>
                <span class="leaderboard-player-score">100000</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">3</span>
                    <span class="leaderboard-player-name">Username1</span>
                </div>
                <span class="leaderboard-player-score">100000</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">4</span>
                    <span class="leaderboard-player-name">Username1</span>
                </div>
                <span class="leaderboard-player-score">100000</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">5</span>
                    <span class="leaderboard-player-name">Username1</span>
                </div>
                <span class="leaderboard-player-score">100000</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">6</span>
                    <span class="leaderboard-player-name">Username1</span>
                </div>
                <span class="leaderboard-player-score">100000</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">7</span>
                    <span class="leaderboard-player-name">Username1</span>
                </div>
                <span class="leaderboard-player-score">100000</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">8</span>
                    <span class="leaderboard-player-name">Username1</span>
                </div>
                <span class="leaderboard-player-score">100000</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">9</span>
                    <span class="leaderboard-player-name">Username1</span>
                </div>
                <span class="leaderboard-player-score">100000</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">10</span>
                    <span class="leaderboard-player-name">Username1</span>
                </div>
                <span class="leaderboard-player-score">100000</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">11</span>
                    <span class="leaderboard-player-name">Username1</span>
                </div>
                <span class="leaderboard-player-score">100000</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">12</span>
                    <span class="leaderboard-player-name">Username1</span>
                </div>
                <span class="leaderboard-player-score">100000</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">13</span>
                    <span class="leaderboard-player-name">Username1</span>
                </div>
                <span class="leaderboard-player-score">100000</span>
            </div>
        </div>
    </aside>
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