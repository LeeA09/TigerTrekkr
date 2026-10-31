<script>
    import { modal, Pause, Skip } from '$lib/modals'
    import { timerSeconds, is_timer_active } from '$lib/stores/game'
    import { PauseIcon, SkipIcon, TimerIcon } from '$lib/shared/icons'

    let { skip } = $props()

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

<div class="top-bar-center">
    <button class="utility-button button-pause" onclick={() => modal.open(Pause)} title="Pause" aria-label="Pause">
        <PauseIcon />
    </button>
    <div class="game-display-banner">
        <TimerIcon />
        <span>{formatted_time}</span>
    </div>
    <button class="utility-button button-skip" onclick={() => modal.open(Skip, { skip })} title="Skip" aria-label="Skip">
        <SkipIcon/>
    </button>
</div>