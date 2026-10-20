<script>
    import { font_size } from '$lib/stores/settings'
    import { modal } from '$lib/modals'
    import { PauseIcon } from '$lib/shared/icons';
        
    // close via esc and click out
    function handle_key_down(event) {
        if (event.key === 'Escape') { modal.close() }
    }
    function handle_backdrop_click(event) {
        if (event.target === event.currentTarget) { modal.close() }
    }
</script>

<svelte:window onkeydown={handle_key_down} />

<div class="modal-background utility-backdrop" role="dialog" aria-modal="true" tabindex="-1" onkeydown={handle_key_down} onclick={handle_backdrop_click} style={`--font-size: ${$font_size}px`}>
    <div class="modal-card">
        <div class="modal-confirm-header">
            <div class="modal-confirm-icon">
                <PauseIcon />
            </div>
            <h3>Game Paused</h3>
        </div>
        <p class="modal-confirm-body">
            have a break, have a kit-kat
        </p>
        <div class="modal-confirm-buttons">
            <button class="home-button" onclick={() => modal.close()}>
                Resume
            </button>
        </div>
    </div>
</div>
