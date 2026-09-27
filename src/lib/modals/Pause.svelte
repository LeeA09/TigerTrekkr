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

<div class="modal-background opaque-backdrop" role="dialog" aria-modal="true" tabindex="-1" onkeydown={handle_key_down} onclick={handle_backdrop_click} style={`--font-size: ${$font_size}px`}>
    <div class="modal-card">
        <div class="modal-confirm-header">
            <div class="modal-confirm-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="6" y="2.5" width="4" height="19" rx="2" ry="2" />
                    <rect x="14" y="2.5" width="4" height="19" rx="2" ry="2" />
                </svg>
            </div>
            <h3>Game Paused</h3>
        </div>
        <p class="modal-confirm-body">
            have a break, have a kit-kat
        </p>
        <div class="modal-confirm-buttons">
            <button class="home-button" onclick={onClose}>
                Resume
            </button>
        </div>
    </div>
</div>