<script>
    import { goto } from '$app/navigation'
    import { font_size } from '$lib/stores/settings'
    import { modal } from '$lib/modals'    
    
    function handle_skip() {
	modal.close()
	goto('/answer')
    }

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
        <button type="button" class="modal-close-button" onclick={() => modal.close()} aria-label="Close help">✖</button>
        <div class="modal-confirm-header">
            <div class="modal-confirm-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="
                    M 3 5.5 
                    Q 3 2.5 5.8 4.7 
                    L 12.2 9.8 
                    Q 15 12 12.2 14.2 
                    L 5.8 19.3 
                    Q 3 21.5 3 18.5 
                    Z
                " />
                <rect x="17" y="2.5" width="4" height="19" rx="2" ry="2" />
                </svg>
            </div>
            <h3>Skip Round?</h3>
        </div>
        <p class="modal-confirm-body">
            You will recieve zero points.
        </p>
        <div class="modal-confirm-buttons">
            <button class="home-button" onclick={handle_skip}>
                Skip
            </button>
        </div>
    </div>
</div>
