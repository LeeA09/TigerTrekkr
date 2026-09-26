<script>
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
    <div class="info-card page-body-card modal-card">
        <h2>Information</h2>
        <div class="info-grid">
            <div class="info-item">
                <h3>Creators</h3>
                <p>Team Rubber Ducky</p>
                <p>Anna</p>
                <p>Gina</p>
                <p>Isiaiah</p>
                <p>Jenaya</p>
                <p>LeaAnn</p>
                <p>Tessa</p>
            </div>
            <div class="info-item">
                <h3>Credits</h3>
                <p>Svelte</p>
                <p>Marzipano</p>
                <p>Leaflet</p>
                <p>OpenStreetMap</p>
                <p>others...</p>
            </div>
        </div>
        <button type="button" class="button-secondary" onclick={onClose}>
            Close
        </button>
    </div>
</div>