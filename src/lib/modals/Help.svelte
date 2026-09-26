<script>
    import { font_size } from '$lib/stores/settings';

    let { onClose } = $props();

    // faq controls
    let open_faq = $state(0);
    function toggle_faq(faq_number) {
        if (open_faq === faq_number) {
            open_faq = 0;
        } else {
            open_faq = faq_number;
        }
    }

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
    <div class="help-card page-body-card modal-card">
        <h2>Help</h2>
        <div class="help-grid">
            <div class="help-item">
                <h3>Goal</h3>
                <p>click around columbia. score points to climb the leaderboard. waddle around and make new friends. como sweet home.</p>
            </div>
            <div class="help-item">
                <h3>How to Play</h3>
                <p>make an account or play as a guest. choose a difficulty. look around by panning and zooming and try to guess where you are. place a duck on the map where you think you are. learn a bit more about mizzou's campus.</p>
            </div>
            <div class="help-item help-faq-item">
                <h3>FAQ</h3>
                <button type="button" class="help-faq-question" onclick={() => toggle_faq(1)} aria-expanded={open_faq === 1}>
                    <p>What color's my underwear?</p>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class:faq-open={open_faq === 1}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                {#if open_faq === 1}
                    <p class="help-faq-answer">
                        *slap*
                    </p>
                {/if}
                <button type="button" class="help-faq-question" onclick={() => toggle_faq(2)} aria-expanded={open_faq === 2}>
                    <p>why ducks</p>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class:faq-open={open_faq === 2}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                {#if open_faq === 2}
                    <p class="help-faq-answer">
                        why not
                    </p>
                {/if}
                <button type="button" class="help-faq-question" onclick={() => toggle_faq(3)} aria-expanded={open_faq === 3}>
                    <p>Is it a rip-off of GeoGuessr?</p>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class:faq-open={open_faq === 3}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                {#if open_faq === 3}
                    <p class="help-faq-answer">
                        who's to say. lightly inspired. perchance
                    </p>
                {/if}
            </div>
        </div>
        <button type="button" class="button-secondary" onclick={onClose}>
            Close
        </button>
    </div>
</div>