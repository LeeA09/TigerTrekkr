<script>
    import { goto, invalidateAll } from '$app/navigation';
    import { page } from '$app/state'
    import { font_size, is_guest, selected_difficulty } from '$lib/stores/settings'
    import { modal, Settings, Help, Info, PlayAsGuest } from '$lib/modals'
    import { onMount } from 'svelte';
    import { animateBackground } from '$lib/shared/backgroundAnimation'

    let { data } = $props();
    let user = $derived(page.data?.user);

    $effect(() => {
        if(user) { is_guest.set(false) }
        else { is_guest.set(true) }
    })

    // random splash texts for logged-in
    const splashTexts = [
        ['Hello ', '!'],
        ['Welcome ', '!'],
        ['How are you, ', '?'],
        ['Welcome back, ', '!'],
        ['Welcome home, ', '.'],
        ['Good to see you, ', '!'],
        ['You look nice today, ', '!'],
        ['What’s up, ', '?'],
        ['Howdy, ', '!'],
        ['Ahoy, ', '!'],
        ['Well, well, well, ', '...'],
        ['You come here often, ', '?'],
        ['Greetings, ', '!'],
        ['', '. Perchance.'],
        ['Good yard, ', '.'],
        ['Big brain time, ', '!'],
        ['North is up, ', '.'],
        ['Ready, set, guess, ', '!'],
        ['Ready to explore, ', '?'],
        ['Let’s trek, ', '!'],
        ['The campus awaits, ', '...'],
        ['Ready for another round, ', '?'],
        ['Back for more, ', '?'],
        ['Back in COMO, ', '?'],
        ['Tiger pride, ', '!'],
        ['MIZ ', '!'],
        ['Let the guessing begin, ', '.'],
        ['Lovely weather we’re having, ', '!'],
        ['No pressure, ', '.'],
        ['Trekking is your specialty, ', '!'],
        ['Did you finish your homework, ', '?'],
        ['You made an account and all you got was this lousy splash text, ', '.'],
        ['1-2-3-4, I declare a thumb war, ', '!'],
        ['Find the hidden rubber ducky, ', '.'],
        ['*blushes and waves at ', '*'],
        ['Don’t get lost, ', '!'],
    ];

    let splashText = $state(['Welcome ', '!']);

    // Animate the background in a figure-8 pattern
    onMount(() => { 
        animateBackground();

        // choose random splash text for logged-in
        splashText = splashTexts[
            Math.floor(Math.random() * splashTexts.length)
        ];
     })

    let leadIsCollapsed = $state(false)

    function toggleLeaderboard() { leadIsCollapsed = !leadIsCollapsed; }

    // go to difficulty
    function move_on() {
        $selected_difficulty = '';
        goto('/difficulty'); 
    }

    async function logout() {
        if (data.supabase) {
            await data.supabase.auth.signOut();
            await invalidateAll();
        }
    }

    function openSettings() { modal.open(Settings, { data: data })}
    function openHelp() { modal.open(Help, { data: data })}
    function openInfo() { modal.open(Info, { data: data })}
    function openPlayAsGuest() { modal.open(PlayAsGuest, {})}

</script>

<div class="page" style={`--font-size: ${$font_size}px`}>
    <main class="page-home" class:leaderboard-open={!leadIsCollapsed}>
        <div class="background-animation"></div>
        <div class="background-overlay"></div>
        <div class="home-center">
            <h1>
                TigerTrekkr
            </h1>
            {#if !user}
            <div class="button-main">
            <button class="home-button" onclick={() => goto('/login')}>
                Log in
            </button>
            <button class="home-button" onclick={() => goto('/signup')}>
                Sign up
            </button>
            <button class="home-button" onclick={openPlayAsGuest}>
                Play as Guest
            </button>
            </div>
            {:else}
            <h2 style="color: #FFFFFF">{splashText[0]}<span style="color: #FFC300">{user.user_metadata?.display_name ?? 'User'}</span>{splashText[1]}</h2>
	    <div class="button-main">
            <button class="home-button" onclick={move_on}>
                Play
            </button>
	    <button class="home-button" onclick={logout}>
		Logout
	    </button>
	    </div>
            {/if}
        </div>
        <div class="button-circle">
            <button class="utility-button" title="Settings" aria-label="Settings" onclick={openSettings}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="
                        M 12 2.5
                        C 14.66 2.5, 13.13 5.66, 14.69 6.41 
                        C 16.25 7.17, 17.77 4, 19.43 6.08 
                        C 21.09 8.16, 17.66 8.93, 18.04 10.62 
                        C 18.43 12.31, 21.85 11.52, 21.26 14.11 
                        C 20.67 16.71, 17.93 14.51, 16.85 15.87 
                        C 15.76 17.22, 18.52 19.41, 16.12 20.56 
                        C 13.73 21.71, 13.74 18.2, 12 18.2 
                        C 10.26 18.2, 10.27 21.71, 7.88 20.56 
                        C 5.48 19.41, 8.24 17.22, 7.15 15.87 
                        C 6.07 14.51, 3.33 16.71, 2.74 14.11 
                        C 2.15 11.52, 5.57 12.31, 5.96 10.62 
                        C 6.34 8.93, 2.91 8.16, 4.57 6.08 
                        C 6.23 4, 7.75 7.17, 9.31 6.41 
                        C 10.87 5.66, 9.34 2.5, 12 2.5 
                        Z
                    "></path>
                </svg>
            </button>
            <button class="utility-button" title="Help" aria-label="Help" onclick={openHelp}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="
                        M 6.5 8.5
                        C 6.5 4.7, 8.9 2, 12 2
                        C 15.5 2, 18.5 4.7, 18.5 8
                        C 18.5 11.2, 16.7 13, 14.5 14.5
                        C 13.5 15.2, 12.8 15.5, 12 15.5
                        C 11.2 15.5, 10.5 15.0, 10.5 14.2
                        C 10.5 13.3, 11.2 12.6, 12.8 12
                        C 14.5 10.9, 15.5 9.8, 15.5 8
                        C 15.5 6.2, 14.1 5, 12.2 5
                        C 10.3 5, 9.5 6.4, 9.5 8.5
                        C 9.5 9.1, 9 9.5, 8 9.5
                        C 7 9.5, 6.5 9.1, 6.5 8.5
                        Z
                    " />
                    <circle cx="12" cy="20" r="1.8" />
                </svg>
            </button>
            <button class="utility-button" title="Info" aria-label="Info" onclick={openInfo}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="4.5" r="2" />
                    <rect x="10" y="9.5" width="4" height="12" rx="2" ry="2" />
                </svg>
            </button>
        </div>
    </main>
    <aside class="home-leaderboard" class:collapsed={leadIsCollapsed}>
        <button class="toggle-btn" onclick={toggleLeaderboard} aria-label="Toggle leaderboard">
            <svg class="chevron" class:rotated={leadIsCollapsed} viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
            <svg class="leaderboard-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 12.8 3.8 15 4 13.3 5.4 13.9 7.6 12 6.4 10.1 7.6 10.7 5.4 9 4 11.2 3.8"></polygon>
                <path d="M 2 20 h 20 M 3 20 v -7 h 5 v -4 h 8 v 7 h 5 v 4 M 8 13 v 7 M 16 16 v 4"></path>
            </svg>
        </button>
        <div class="leaderboard-content">
            <h2>
                Leaderboard
            </h2>
            <div class="leaderboard-players">
                <div class="leaderboard-player">
                    <div class="leaderboard-player-info">
                        <span class="leaderboard-player-rank">1</span>
                        <span class="leaderboard-player-name">Username0</span>
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
                        <span class="leaderboard-player-name">Username2</span>
                    </div>
                    <span class="leaderboard-player-score">100000</span>
                </div>
                <div class="leaderboard-player">
                    <div class="leaderboard-player-info">
                        <span class="leaderboard-player-rank">4</span>
                        <span class="leaderboard-player-name">Username3</span>
                    </div>
                    <span class="leaderboard-player-score">100000</span>
                </div>
                <div class="leaderboard-player">
                    <div class="leaderboard-player-info">
                        <span class="leaderboard-player-rank">5</span>
                        <span class="leaderboard-player-name">Username4</span>
                    </div>
                    <span class="leaderboard-player-score">100000</span>
                </div>
                <div class="leaderboard-player">
                    <div class="leaderboard-player-info">
                        <span class="leaderboard-player-rank">6</span>
                        <span class="leaderboard-player-name">Username5</span>
                    </div>
                    <span class="leaderboard-player-score">100000</span>
                </div>
                <div class="leaderboard-player">
                    <div class="leaderboard-player-info">
                        <span class="leaderboard-player-rank">7</span>
                        <span class="leaderboard-player-name">Username6</span>
                    </div>
                    <span class="leaderboard-player-score">100000</span>
                </div>
                <div class="leaderboard-player">
                    <div class="leaderboard-player-info">
                        <span class="leaderboard-player-rank">8</span>
                        <span class="leaderboard-player-name">Username7</span>
                    </div>
                    <span class="leaderboard-player-score">100000</span>
                </div>
                <div class="leaderboard-player">
                    <div class="leaderboard-player-info">
                        <span class="leaderboard-player-rank">9</span>
                        <span class="leaderboard-player-name">Username8</span>
                    </div>
                    <span class="leaderboard-player-score">100000</span>
                </div>
                <div class="leaderboard-player">
                    <div class="leaderboard-player-info">
                        <span class="leaderboard-player-rank">10</span>
                        <span class="leaderboard-player-name">Username9</span>
                    </div>
                    <span class="leaderboard-player-score">100000</span>
                </div>
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
