<script>
    import { goto } from '\$app/navigation';

    import { font_size, is_guest, selected_difficulty } from '$lib/stores/settings';

    import Settings from '$lib/modals/settings.svelte';
    import Help from '$lib/modals/Help.svelte';
    import Info from '$lib/modals/Info.svelte';
    import PlayAsGuest from '$lib/modals/PlayAsGuest.svelte';

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

    // utility modals
    let is_settings_open = $state(false);
    let is_help_open = $state(false);
    let is_info_open = $state(false);

    function open_settings() { is_settings_open = true; }
	function close_settings() { is_settings_open = false; }
	function open_help() { is_help_open = true; }
	function close_help() { is_help_open = false; }
	function open_info() { is_info_open = true; }
	function close_info() { is_info_open = false; }

    // confirmation modals
    let is_play_as_guest_open = $state(false);

    function open_play_as_guest() { is_play_as_guest_open = true; }
    function close_play_as_guest() { is_play_as_guest_open = false; }

    // settings
    let is_sound_on = $state(true);
    let is_music_on = $state(true);

    function toggle_music() { is_music_on = !is_music_on; }
	function toggle_sound() { is_sound_on = !is_sound_on; }

    // go to difficulty
    function move_on() {
        $selected_difficulty = '';
        goto('/difficulty'); 
    }
</script>

<div class="page" style={`--font-size: ${$font_size}px`}>
    <main class="page-home">
        <div class="background-animation"></div>
        <div class="background-overlay"></div>
        <div class="home-center">
            <h1>
                TigerTrekkr
            </h1>
            <div class="button-main">
                {#if is_guest}
                <button class="home-button" onclick={() => goto('/login')}>
                    Log in
                </button>
                <button class="home-button" onclick={() => goto('/signup')}>
                    Sign up
                </button>
                <button class="home-button" onclick={open_play_as_guest}>
                    Play as Guest
                </button>
                {:else}
                <button class="home-button" onclick={move_on}>
                    Play
                </button>
                {/if}
            </div>
        </div>
        <div class="button-circle">
            <button class="utility-button" title="Settings" aria-label="Settings" onclick={open_settings}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
            </button>
            <button class="utility-button" title="Help" aria-label="Help" onclick={open_help}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            </button>
            <button class="utility-button" title="Info" aria-label="Info" onclick={open_info}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
            </button>
        </div>
    </main>
    <aside class="home-leaderboard">
        <h2>
            Leaderboard
        </h2>
        <div class="leaderboard-players">
            <div class="leaderboard-player">
                <div class="leaderboard-player-info">
                    <span class="leaderboard-player-rank">1</span>
                    <span class="leaderboard-player-name">Usernameeeeeeeeeeeeeeeeeeeeeeeeeee</span>
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
    {#if is_settings_open}
        <Settings onClose={close_settings} />
    {/if}
    {#if is_help_open}
        <Help onClose={close_help} />
    {/if}
    {#if is_info_open}
        <Info onClose={close_info} />
    {/if}
    {#if is_play_as_guest_open}
        <PlayAsGuest onClose={close_play_as_guest} />
    {/if}
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