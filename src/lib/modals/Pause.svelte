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
                    <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                    <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                </svg>
            </div>
            <h3>Game Paused</h3>
        </div>
        <p class="modal-confirm-body">
            Take your time. Resume whenever you're ready.
        </p>
        <div class="modal-confirm-buttons">
            <button class="button-secondary" onclick={onClose}>
                Resume
            </button>
        </div>
    </div>
</div>