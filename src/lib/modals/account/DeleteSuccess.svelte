<script>
    import { font_size } from '$lib/stores/settings'
    import { modal } from '$lib/modals'

    // close via esc and click out
    function handle_key_down(event) {
        if (event.key === 'Escape') { modal.close() }
    }
    function handle_backdrop_click(event) {
        if (event.target === event.currentTarget) { modal.close() }
    }
</script>

<svelte:window onkeydown={handle_key_down} />

<div class="modal-background" role="dialog" aria-modal="true" tabindex="-1" onkeydown={handle_key_down} onclick={handle_backdrop_click} style={`--font-size: ${$font_size}px`}>
    <div class="modal-card">
        <div class="modal-confirm-header">
            <h3>Account Deleted</h3>
        </div>
        <p class="modal-confirm-body">
            Your account has been successfully deleted.
        </p>
        <div class="modal-confirm-buttons">
            <button class="button-secondary" onclick={() => modal.close()}>
                Close
            </button>
        </div>
    </div>
</div>