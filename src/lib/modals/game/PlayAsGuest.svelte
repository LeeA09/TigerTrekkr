<script>
    import { goto } from '$app/navigation'
    import { font_size } from '$lib/stores/settings'
    import { modal } from '$lib/modals'
    import { WarningIcon } from '$lib/shared/icons'

    // close via esc and click out
    function handle_key_down(event) {
        if (event.key === 'Escape') { modal.close() }
    }
    function handle_backdrop_click(event) {
        if (event.target === event.currentTarget) { modal.close() }
    }

    // go to difficulty screen
    function move_on() {
	    modal.close();
        goto('/game/difficulty');
    }
</script>

<svelte:window onkeydown={handle_key_down} />

<div class="modal-background" role="dialog" aria-modal="true" tabindex="-1" onkeydown={handle_key_down} onclick={handle_backdrop_click} style={`--font-size: ${$font_size}px`}>
    <div class="modal-card">
        <button type="button" class="modal-close-button" onclick={() => modal.close()} aria-label="Close help">✖</button>
        <div class="modal-confirm-header">
            <div class="modal-confirm-icon">
                <WarningIcon />
            </div>
            <h3>Play as Guest?</h3>
        </div>
        <p class="modal-confirm-body">
            Your scores will <strong>not</strong> be saved to the leaderboard.
            <a href="/account/login" onclick={() => goto('/account/login')} class="page-body-card-link">Log in</a>
            to save your scores.
        </p>
        <div class="modal-confirm-buttons">
            <button class="home-button" onclick={move_on}>
                Continue as Guest
            </button>
        </div>
    </div>
</div>
