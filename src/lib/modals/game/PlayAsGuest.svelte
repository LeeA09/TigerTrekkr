<script>
    import { goto } from '$app/navigation';
    import { font_size, is_guest, selected_difficulty } from '$lib/stores/settings';

    let { onClose } = $props();

    // close via esc and click out
    function handle_key_down(event) {
        if (event.key === 'Escape') {
            onClose();
        }
    }
    function handle_backdrop_click(event) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    // go to difficulty screen
    function move_on() {
        $is_guest = true;
        $selected_difficulty = '';
        goto('/difficulty'); 
    }
</script>

<svelte:window onkeydown={handle_key_down} />

<div class="modal-background" role="dialog" aria-modal="true" tabindex="-1" onkeydown={handle_key_down} onclick={handle_backdrop_click} style={`--font-size: ${$font_size}px`}>
    <div class="modal-card">
        <div class="modal-confirm-header">
            <div class="modal-confirm-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            </div>
            <h3>Play as Guest?</h3>
        </div>
        <p class="modal-confirm-body">
            Your scores will <strong>not</strong> be saved to the leaderboard.
        </p>
        <div class="modal-confirm-buttons">
            <button class="home-button" onclick={move_on}>
                Continue as Guest
            </button>
            <button class="button-secondary" onclick={onClose}>
                Cancel
            </button>
        </div>
    </div>
</div>