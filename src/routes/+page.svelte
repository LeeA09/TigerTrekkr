<script>
    import { goto, refreshAll } from '$app/navigation';
    import { page } from '$app/state'
    import { font_size } from '$lib/stores/settings'
    import { modal, Settings, Help, Info, PlayAsGuest } from '$lib/modals'
    import { onMount } from 'svelte';
    import { animateBackground } from '$lib/shared/backgroundAnimation'
    import { SettingsIcon, HelpIcon, InfoIcon, BugReporterIcon, LeaderboardIcon, LeadChevronIcon } from '$lib/shared/icons'

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
            await refreshAll();
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
                <BugReporterIcon />                    
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
