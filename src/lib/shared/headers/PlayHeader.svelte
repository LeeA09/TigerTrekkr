<script>
    import { modal, Pause, Skip, Quit } from '$lib/modals'
    import { timerSeconds, is_timer_active, selected_difficulty } from '$lib/stores/game'
    import { PauseIcon, SkipIcon, TimerIcon } from '$lib/shared/icons'
    import Utilities from './Utilities.svelte';

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
        if ($timerSeconds > 0 && !is_timer_paused && $is_timer_active) {
            const timer = setInterval(() => {
                timerSeconds.update((s) => Math.max(0, s - 1))
            }, 1000);

            return () => clearInterval(timer);
        }
    });
</script>

<header class="top-bar">
    <button class="top-bar-home-link" onclick={() => modal.open(Quit)} title="Return to Home" aria-label="Return to Home">
        <span class="top-bar-home-title">TigerTrekkr</span>
    </button>
    <div class="button-circle-top">
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
        <Utilities />
    </div>
</header>

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