<script>
    import { goto } from '$app/navigation'
    import { font_size } from '$lib/stores/settings'
    import { modal } from '$lib/modals'
    
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

<div class="modal-background opaque-backdrop" role="dialog" aria-modal="true" tabindex="-1" onkeydown={handle_key_down} onclick={handle_backdrop_click} style={`--font-size: ${$font_size}px`}>
    <div class="modal-card">
        <div class="modal-confirm-header">
            <div class="modal-confirm-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="
                        M 12 9.17 
                        L 16.97 4.2
                        A 2 2 0 0 1 19.8 7.03
                        L 14.83 12
                        L 19.8 16.97
                        A 2 2 0 0 1 16.97 19.8
                        L 12 14.83
                        L 7.03 19.8
                        A 2 2 0 0 1 4.2 16.97
                        L 9.17 12
                        L 4.2 7.03
                        A 2 2 0 0 1 7.03 4.2
                        Z
                    " />
                </svg>
            </div>
            <h3>Quit Game?</h3>
        </div>
        <p class="modal-confirm-body">
            Are you sure you want to quit? Your game progress will be lost.
        </p>
        <div class="modal-confirm-buttons">
            <button class="home-button" onclick={handle_quit}>
                Quit
            </button>
            <button class="button-secondary" onclick={() => modal.close()}>
                Cancel
            </button>
        </div>
    </div>
</div>
