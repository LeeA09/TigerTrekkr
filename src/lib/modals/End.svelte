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
                    <path d="M10 17l5-5-5-5"></path>
                    <path d="M15 12H3"></path>
                    <path d="M21 3v18"></path>
                </svg>
            </div>
            <h3>Quit Game?</h3>
        </div>
        <p class="modal-confirm-body">
            Are you sure you want to quit and return home? Your current game progress will be lost.
        </p>
        <div class="modal-confirm-buttons">
            <button class="home-button" onclick={() => goto('/')}>
                Quit
            </button>
            <button class="button-secondary" onclick={onClose}>
                Cancel
            </button>
        </div>
    </div>
</div>