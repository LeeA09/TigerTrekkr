<script>
    import { goto } from '\$app/navigation'
    import { font_size } from '$lib/stores/settings'
    import { modal, Settings, Help, Info, Pause, Skip, Quit } from '$lib/modals'
    import { onMount } from 'svelte'
    import { animateBackground } from '$lib/shared/backgroundAnimation'
    import { page } from '$app/state'
    import { timerSeconds, is_timer_active, selected_difficulty } from '$lib/stores/game'
    import { PauseIcon, SkipIcon, SettingsIcon, HelpIcon, InfoIcon, TimerIcon } from '$lib/shared/icons'

    let { children } = $props()
    let isPlayPage = $derived(page.url.pathname.startsWith('/play'))
    let isAnswerPage = $derived(page.url.pathname.startsWith('/answer'))

    // Animate the background in a figure-8 pattern
    onMount(() => {
        if(!isPlayPage && !isAnswerPage){ animateBackground() }
    })

    // Game timer
    let is_timer_paused = $derived(modal.stack.length > 0);

    let formatted_time = $derived.by(() => {
        const total = $timerSeconds
        const mins = Math.floor(total / 60).toString().padStart(2, '0')
        const secs = (total % 60).toString().padStart(2, '0')
        return `${mins}:${secs}`
    });

    // Timer runs only while no modal is open, and only if is play page
    $effect(() => {
	    if(isPlayPage){
            if ($timerSeconds > 0 && !is_timer_paused && $is_timer_active) {
                const timer = setInterval(() => {
                    timerSeconds.update((s) => Math.max(0, s - 1))
                }, 1000);

                return () => clearInterval(timer);
            }
	    }  
    });
</script>

<div class="page" style="--app-font-size: {$font_size}px">
    <div class="page-background">
        <header class="top-bar">
	    {#if isPlayPage}
		<button class="top-bar-home-link" onclick={() => modal.open(Quit)} title="Return to Home" aria-label="Return to Home">
		    <span class="top-bar-home-title">TigerTrekkr</span>
		</button>
	    {:else}
        <button class="top-bar-home-link" onclick={() => goto('/')} title="Return to Home" aria-label="Return to Home">
            <span class="top-bar-home-title">TigerTrekkr</span>
        </button>
	    {/if}
            <div class="button-circle-top">
                {#if isPlayPage}
                <div class="top-bar-center">
                    <button class="utility-button button-pause" onclick={() => modal.open(Pause)} title="Pause" aria-label="Pause">
                        <PauseIcon />
                    </button>
                    <button class="utility-button button-skip" onclick={() => modal.open(Skip)} title="Skip" aria-label="Skip">
                        <SkipIcon />
                    </button>
                    <div class="timer-display">
                        <TimerIcon />
                        <span>{formatted_time}</span>
                    </div>
        		{#if $selected_difficulty}
            		<span class="difficulty-badge difficulty-{$selected_difficulty}">
                		{$selected_difficulty}
            		</span>
        		{/if}
    		    </div>
                {/if}
                <button class="utility-button" title="Settings" aria-label="Settings" onclick={() => modal.open(Settings)}>
                    <SettingsIcon />
                </button>
                <button class="utility-button" title="Help" aria-label="Help" onclick={() => modal.open(Help)}>
                    <HelpIcon />
                </button>
                <button class="utility-button" title="Info" aria-label="Info" onclick={() => modal.open(Info)}>
                    <InfoIcon />
                </button>
            </div>
        </header>
        {#if isPlayPage}
            <div class="play-body">{@render children()}</div>
        {:else}
            <div class="page-body">
                <div class="background-animation"></div>
                <div class="background-overlay"></div>
                {@render children()}
            </div>
        {/if}
    </div>
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
    :global(body), .page {
        font-size: var(--app-font-size) !important;
    }
</style>
