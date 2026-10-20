<script>
    import { goto } from '$app/navigation'
    import { font_size } from '$lib/stores/settings'
    import { modal } from '$lib/modals'
    import { QuitIcon } from '$lib/shared/icons'
    
    // close via esc and click out
    function handle_key_down(event) {
        if (event.key === 'Escape') { modal.close() }
    }
    function handle_backdrop_click(event) {
        if (event.target === event.currentTarget) { modal.close() }
    }

    function handle_quit() {
	modal.close()
	goto('/')
    }
</script>

<svelte:window onkeydown={handle_key_down} />

<div class="modal-background utility-backdrop" role="dialog" aria-modal="true" tabindex="-1" onkeydown={handle_key_down} onclick={handle_backdrop_click} style={`--font-size: ${$font_size}px`}>
    <div class="modal-card">
        <button type="button" class="modal-close-button" onclick={() => modal.close()} aria-label="Close help">✖</button>
        <div class="modal-confirm-header">
            <div class="modal-confirm-icon">
                <QuitIcon />
            </div>
            <h3>Quit Game?</h3>
        </div>
        <p class="modal-confirm-body">
            Your game progress will be lost!
        </p>
        <div class="modal-confirm-buttons">
            <button class="home-button" onclick={handle_quit}>
                Quit
            </button>
        </div>
    </div>
</div>
