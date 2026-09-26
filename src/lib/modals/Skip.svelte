<script>
    import { goto } from '$app/navigation';
    import { font_size } from '$lib/stores/settings';

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
</script>

<svelte:window onkeydown={handle_key_down} />

<div class="modal-background" role="dialog" aria-modal="true" tabindex="-1" onkeydown={handle_key_down} onclick={handle_backdrop_click} style={`--font-size: ${$font_size}px`}>
    <div class="modal-card">
        <div class="modal-confirm-header">
            <div class="modal-confirm-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 4 15 12 5 20 5 4"></polygon>
                    <line x1="19" y1="5" x2="19" y2="19"></line>
                </svg>
            </div>
            <h3>Skip Round?</h3>
        </div>
        <p class="modal-confirm-body">
            Are you sure you want to skip this round? You will recieve 0 points.
        </p>
        <div class="modal-confirm-buttons">
            <button class="home-button" onclick={goto('/answer')}>
                Skip
            </button>
            <button class="button-secondary" onclick={onClose}>
                Cancel
            </button>
        </div>
    </div>
</div>