<script>
    import { font_size } from '$lib/stores/settings'
    import { modal } from '$lib/modals'   
    import { SkipIcon } from '$lib/shared/icons' 
    import { get } from 'svelte/store'
    import { activeSubmitHandler } from '$lib/stores/game';
    
    let { submit_guess } = $props();

    async function handle_skip() {
        modal.close()

        const submit = get(activeSubmitHandler);

        if(submit) {
            await submit({ lat: 100, lng: 200 });
        }
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
                <SkipIcon />
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
