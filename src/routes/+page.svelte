<script>
    import { goto, invalidateAll } from '$app/navigation';
    import { page } from '$app/state'
    import { font_size } from '$lib/stores/settings'
    import { modal, Settings, Help, Info, PlayAsGuest } from '$lib/modals'
    import { onMount } from 'svelte';
    import { animateBackground } from '$lib/shared/backgroundAnimation'
    import { SettingsIcon, HelpIcon, InfoIcon, LeaderboardIcon, LeadChevronIcon } from '$lib/shared/icons'

    let { data } = $props();
    let user = $derived(page.data?.user);

    let user_info = $derived(data?.userdata);
    let userOnLeaderboard = $derived(user_info && data.leaderboard?.some(player => player.username === user_info.username));

    const leaderboard = Array.from({ length: 10}, (_, i) => data.leaderboard[i] || null);
    let leadIsCollapsed = $state(false)

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

    async function logout() {
        if (data.supabase) {
            await data.supabase.auth.signOut();
            await invalidateAll();
        }
    }

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
            <button class="home-button" onclick={() => modal.open(PlayAsGuest)}>
                Play as Guest
            </button>
            </div>
            {:else}
            <!-- OR color: #FFC300 -->
            <h2 style="color: #FFFFFF">{splashText[0]}<span style="color: #FFffff">{user_info?.username ?? 'User'}</span>{splashText[1]}</h2>
	    <div class="button-main">
            <button class="home-button" onclick={() => goto('/difficulty')}>
                Play
            </button>
            <button class="home-button" onclick={logout}>
                Logout
            </button>
	    </div>
            {/if}
        </div>
        <div class="button-circle">
            <button class="utility-button" title="Settings" aria-label="Settings" onclick={() => modal.open(Settings)}>
                <SettingsIcon />
            </button>
            <button class="utility-button" title="Help" aria-label="Help" onclick={() => modal.open(Help)}>
                <HelpIcon />
            </button>
            <button class="utility-button" title="Info" aria-label="Info" onclick={() => modal.open(Info)}>
                <InfoIcon />
            </button>
			<button class="utility-button" title="Report Bug" aria-label="BugReporting" onclick={() => {window.open('https://forms.gle/L4X5HsRshrMzSD9k8', '_blank', 'noopener,noreferrer');}}>
                    <svg fill="currentColor" stroke="currentColor" height="64px" width="64px" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M304 280h416c4.4 0 8-3.6 8-8 0-40-8.8-76.7-25.9-108.1-17.2-31.5-42.5-56.8-74-74C596.7 72.8 560 64 520 64h-16c-40 0-76.7 8.8-108.1 25.9-31.5 17.2-56.8 42.5-74 74C304.8 195.3 296 232 296 272c0 4.4 3.6 8 8 8z"></path> <path d="M940 512H792V412c76.8 0 139-62.2 139-139 0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 34.8-28.2 63-63 63H232c-34.8 0-63-28.2-63-63 0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 76.8 62.2 139 139 139v100H84c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h148v96c0 6.5.2 13 .7 19.3C164.1 728.6 116 796.7 116 876c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-44.2 23.9-82.9 59.6-103.7 6 17.2 13.6 33.6 22.7 49 24.3 41.5 59 76.2 100.5 100.5 28.9 16.9 61 28.8 95.3 34.5 4.4 0 8-3.6 8-8V484c0-4.4 3.6-8 8-8h60c4.4 0 8 3.6 8 8v464.2c0 4.4 3.6 8 8 8 34.3-5.7 66.4-17.6 95.3-34.5 41.5-24.3 76.2-59 100.5-100.5 9.1-15.5 16.7-31.9 22.7-49C812.1 793.1 836 831.8 836 876c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-79.3-48.1-147.4-116.7-176.7.4-6.4.7-12.8.7-19.3v-96h148c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path> </g></svg>
                    
            </button>
        </div>
    </main>
    <aside class="home-leaderboard" class:collapsed={leadIsCollapsed}>
        <button class="toggle-btn" onclick={() => (leadIsCollapsed = !leadIsCollapsed)} aria-label="Toggle leaderboard">
            <LeadChevronIcon rotated={leadIsCollapsed}/>
            <LeaderboardIcon />
        </button>
        <div class="leaderboard-content">
            <h2>
                Leaderboard
            </h2>
            <div class="leaderboard-players">
                {#each leaderboard as player, index}
                    <div class="leaderboard-player" class:empty={!player}>
                        <div class="leaderboard-player-info">
                            <span class="leaderboard-player-rank">{index + 1}</span>
                            {#if player}
                                <span class="leaderboard-player-name">{player.username}</span>
                            {:else}
                                <span class="leaderboard-player-name placeholder">—</span>
                            {/if}
                        </div>
                        {#if player}
                            <span class="leaderboard-player-score">{player.totalscore}</span>
                        {:else}
                            <span class="leaderboard-player-score placeholder">—</span>
                        {/if}
                    </div>
                {/each}
                {#if user && user_info && !userOnLeaderboard}
                    <hr />
                    <hr />
                    <hr />
                    <div class="leaderboard-player">
                        <div class="leaderboard-player-info">
                            <span class="leaderboard-player-rank">★</span>
                            <span class="leaderboard-player-name">{user_info.username}</span>
                        </div>
                        <span class="leaderboard-player-score">{user_info.totalscore}</span>
                    </div>
                {/if}
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
