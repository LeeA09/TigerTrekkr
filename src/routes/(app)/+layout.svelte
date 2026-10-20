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
				<button class="utility-button" title="Report Bug" aria-label="BugReporting" onclick={() => {window.open('https://forms.gle/L4X5HsRshrMzSD9k8', '_blank', 'noopener,noreferrer');}}>
                    <svg fill="currentColor" stroke="currentColor" height="64px" width="64px" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
						<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
						<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
						<g id="SVGRepo_iconCarrier"> 
							<path d="M304 280h416c4.4 0 8-3.6 8-8 0-40-8.8-76.7-25.9-108.1-17.2-31.5-42.5-56.8-74-74C596.7 72.8 560 64 520 64h-16c-40 0-76.7 8.8-108.1 25.9-31.5 17.2-56.8 42.5-74 74C304.8 195.3 296 232 296 272c0 4.4 3.6 8 8 8z"></path> <path d="M940 512H792V412c76.8 0 139-62.2 139-139 0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 34.8-28.2 63-63 63H232c-34.8 0-63-28.2-63-63 0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 76.8 62.2 139 139 139v100H84c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h148v96c0 6.5.2 13 .7 19.3C164.1 728.6 116 796.7 116 876c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-44.2 23.9-82.9 59.6-103.7 6 17.2 13.6 33.6 22.7 49 24.3 41.5 59 76.2 100.5 100.5 28.9 16.9 61 28.8 95.3 34.5 4.4 0 8-3.6 8-8V484c0-4.4 3.6-8 8-8h60c4.4 0 8 3.6 8 8v464.2c0 4.4 3.6 8 8 8 34.3-5.7 66.4-17.6 95.3-34.5 41.5-24.3 76.2-59 100.5-100.5 9.1-15.5 16.7-31.9 22.7-49C812.1 793.1 836 831.8 836 876c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-79.3-48.1-147.4-116.7-176.7.4-6.4.7-12.8.7-19.3v-96h148c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z">
							</path> 
						</g>
					</svg>
                    
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
