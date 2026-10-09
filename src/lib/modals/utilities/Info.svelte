<script>
    import { font_size } from '$lib/stores/settings'
    import { modal } from '$lib/modals'

    let { opaque = false } = $props()

    // close via esc and click out
    function handle_key_down(event) { 
        if (event.key === 'Escape') { modal.close() } 
    }
    function handle_backdrop_click(event) {
        if (event.target === event.currentTarget) { modal.close() }
    }
</script>

<svelte:window onkeydown={handle_key_down} />

<div class="modal-background" class:utility-backdrop={opaque} role="dialog" aria-modal="true" tabindex="-1" onkeydown={handle_key_down} onclick={handle_backdrop_click} style={`--font-size: ${$font_size}px`}>
    <div class="info-card page-body-card modal-card">
	<button type="button" class="modal-close-button" onclick={() => modal.close()} aria-label="Close help">✖</button>
        <h2>Information</h2>
        <div class="info-grid">
            <div class="info-item">
                <h3>Creators—Team Rubber Ducky</h3>
		        <ul>
                	<li>Anna Mori</li>
                	<li>Gina Hua</li>
                	<li>Isaiah Korte</li>
                	<li>Jenaya Monroe</li>
                	<li>LeeAnn Lin</li>
                	<li>Tessa Mitchell</li>
		        </ul>
            </div>
            <div class="info-item">
                <h3>Credits</h3>
                <ul>
			        <li>Svelte</li>
                	<li>Marzipano</li>
                	<li>Leaflet</li>
                	<li>OpenStreetMap</li>
                	<li>Supabase</li>
                	<li>PostgreSQL</li>
		        </ul>
            </div>
        </div>
    </div>
</div>

<style>
  ul {
	list-style-type: none;
	padding-left: 1rem;
  }  

  li::before {
	content: "• ";
  }
</style>
