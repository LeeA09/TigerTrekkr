<script>
    // @ts-nocheck
    
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

<svelte:head>
    <title>TigerTrekkr</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
    <link
        href="https://fonts.googleapis.com/css2?family=Actor&family=Rubik+Vinyl&display=swap"
        rel="stylesheet"
    />
</svelte:head>


<div class="page">
    <main class="home-page">
        <div class="background-animation"></div>
        <div class="background-overlay"></div>
        <div class="home-main">
            <h1>TigerTrekkr</h1>
            <div class="button-submit">
                <button class="button-main" disabled>
                    Log in
                </button>
                <button class="button-main" disabled>
                    Sign up
                </button>
                <button class="button-main" disabled>
                    Play as guest
                </button>
            </div>
        </div>

        <div class="button-circle">
            <button class="button-utility" title="Settings" aria-label="Settings">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
				</button>
				<button class="button-utility" title="Help" aria-label="Help">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
				</button>
				<button class="button-utility" title="Info" aria-label="Info">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
				</button>
        </div>
    </main>
    <aside class="leaderboard">
        <h2>Leaderboard</h2>
        <div class="leaderboard-players">
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">1</span>
                    <span class="leaderboard-player-username">Username 1</span>
                </div>
                <span class="leaderboard-player-score">100000</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">2</span>
                    <span class="leaderboard-player-username">Username 2</span>
                </div>
                <span class="leaderboard-player-score">99500</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">3</span>
                    <span class="leaderboard-player-username">Username 3</span>
                </div>
                <span class="leaderboard-player-score">99000</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">4</span>
                    <span class="leaderboard-player-username">Username 4</span>
                </div>
                <span class="leaderboard-player-score">98500</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">5</span>
                    <span class="leaderboard-player-username">Username 5</span>
                </div>
                <span class="leaderboard-player-score">98000</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">6</span>
                    <span class="leaderboard-player-username">Username 6</span>
                </div>
                <span class="leaderboard-player-score">97500</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">7</span>
                    <span class="leaderboard-player-username">Username 7</span>
                </div>
                <span class="leaderboard-player-score">97000</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">8</span>
                    <span class="leaderboard-player-username">Username 8</span>
                </div>
                <span class="leaderboard-player-score">96500</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">9</span>
                    <span class="leaderboard-player-username">Username 9</span>
                </div>
                <span class="leaderboard-player-score">96000</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">10</span>
                    <span class="leaderboard-player-username">Username 10</span>
                </div>
                <span class="leaderboard-player-score">95500</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">11</span>
                    <span class="leaderboard-player-username">Username 11</span>
                </div>
                <span class="leaderboard-player-score">95000</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">12</span>
                    <span class="leaderboard-player-username">Username 12</span>
                </div>
                <span class="leaderboard-player-score">94500</span>
            </div>
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">13</span>
                    <span class="leaderboard-player-username">Username 13</span>
                </div>
                <span class="leaderboard-player-score">94000</span>
            </div>
        </div>
    </aside>
</div>

<style>
    :global(*) {
        box-sizing: border-box;
    }
    :global(html),
    :global(body) {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        font-family: "Actor", Arial, Helvetica, sans-serif;
    }

    .page {
        width: 100vw;
        height: 100vh;
        display: flex;
        overflow: hidden;
        background: #001D3D;
    }

    .home-page {
        position: relative;
        width: 80%;
        height: 100vh;
        overflow: hidden;
        background: #001D3D;
    }

    .background-animation {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        background-image: url("/mizzou_image.jpg");
        background-size: cover;
        background-position: center;
        overflow: hidden;
    }

    .background-overlay {
        position: absolute;
        inset: 0;
        background: #001D3D;
        opacity: 0.7;
    }

    .home-main {
        position: absolute;
        z-index: 2;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    h1 {
        margin: 0 0 30px 0;
        color: #FFC300;
        font-family: "Rubik Vinyl", system-ui;
        font-size: 8vw;
        font-weight: 600;
        text-shadow: 3px 4px 0 #001D3D;
    }

    .button-submit {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }

    .button-main {
        width: 200px;
        height: 48px;
        border: none;
        border-radius: 60px;
        background: #DC562E;
        color: #ffffff;
        font-family: "Actor", sans-serif;
        font-size: 20px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .button-main:hover {
        background: #E37A5B;
        transform: scale(1.025);
    }

    .button-circle {
        position: absolute;
        bottom: 15px;
        left: 15px;
        z-index: 10;
        display: flex;
        gap: 10px;
    }

    .button-utility {
        width: 48px;
        height: 48px;
        border: 2px solid #DC562E;
        border-radius: 50%;
        background: #001D3D;
        color: #DC562E;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .button-utility svg {
        width: 22px;
        height: 22px;
    }

    .button-utility:hover {
        background: #DC562E;
        color: #ffffff;
    }

    .leaderboard {
        width: 20%;
        height: 100vh;
        background: #003566;
        padding: 20px 35px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .leaderboard h2 {
        margin: 35px 0 20px 0;
        color: #FFC300;
        text-align: center;
        font-size: 28px;
    }

    .leaderboard-players {
        flex: 1;
        min-height: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .leaderboard-player {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 12px 0;
        border-bottom: 1px solid #001D3D;
        color: #ffffff;
        font-size: 16px;
    }

    .leaderboard-player-info {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .leaderboard-player-rank {
        width: 24px;
        font-weight: 700;
        text-align: center;
    }

    .leaderboard-player-username {
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .leaderboard-player-score {
        font-weight: 700;
    }
</style>