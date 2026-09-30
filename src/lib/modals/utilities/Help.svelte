<script>
    import { font_size } from '$lib/stores/settings';

    let { onClose, opaque = false } = $props();

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

<div class="modal-background" class:utility-backdrop={opaque} role="dialog" aria-modal="true" tabindex="-1" onkeydown={handle_key_down} onclick={handle_backdrop_click} style={`--font-size: ${$font_size}px`}>
    <div class="help-card page-body-card modal-card">
        <button type="button" class="modal-close-button" onclick={onClose} aria-label="Close help">✖</button>
	<h2>Help</h2>
        <div class="help-grid">
            <div class="help-item">
                <h3>Goal</h3>
                <p>Explore the University of Missouri campus and identify each location as accurately as possible. Earn points with every round, learn about Mizzou's history and resources, and climb the global leaderboard.</p>
            </div>
            <div class="help-item">
                <h3>How to Play</h3>
                <p>Create an account or continue as a guest, then select a difficulty level. Look around each 360° image by panning and zooming, and place your duck on the map where you believe the photo was taken. Submit your guess to see the actual location and your score, and learn more about campus along the way.</p>
            </div>
            <div class="help-item">
                <h3 class="need-padding">FAQ</h3>
                <button type="button" class="help-faq-question" onclick={() => toggle_faq(1)} aria-expanded={open_faq === 1}>
                    <p>How does scoring work?</p>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class:faq-open={open_faq === 1}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                {#if open_faq === 1}
                    <p class="help-faq-answer">
                        Each round is worth up to 5,000 points, and your score depends on three things. The first is <strong>distance</strong>: 
                        the closer your pin is to the real location, the more points you earn. Points drop off quickly as your guess 
                        gets farther away, so precision matters on a campus-sized map. Next is <strong>time</strong>: the clock starts when the image 
                        loads and stops when you confirm your guess. You lose a small amount of score for every second you take, so 
                        quick guesses score a little higher. Last is <strong>difficulty</strong>: your result is multiplied by your difficulty bonus, 
                        which is why a nearly perfect guess on Hard can still hit the 5,000 cap.
                    </p>
                {/if}
                <button type="button" class="help-faq-question" onclick={() => toggle_faq(2)} aria-expanded={open_faq === 2}>
                    <p>Do I need an account to play?</p>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class:faq-open={open_faq === 2}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                {#if open_faq === 2}
                    <p class="help-faq-answer">
                        No, you can play as a guest and jump straight into a game. However, guest scores aren't saved or shown on the leaderboard. 
                        Create an account if you want your scores tracked and a shot at the global top 20.
                    </p>
                {/if}
                <button type="button" class="help-faq-question" onclick={() => toggle_faq(3)} aria-expanded={open_faq === 3}>
                    <p>What do the difficulty levels change?</p>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class:faq-open={open_faq === 3}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                {#if open_faq === 3}
                    <p class="help-faq-answer">
                        Difficulty controls how much you can look around in the 360° image. On <strong>Easy</strong> you get full 360° rotation and zoom. On 
                        <strong>Medium</strong> you can rotate 180° and zoom. On <strong>Hard</strong> you get a still image with zoom only. Harder levels also multiply your score: 1.0× on Easy, 1.1× on Medium, and 1.2× on Hard. You pick a difficulty before the game starts, and it stays the same for the whole round.
                    </p>
                {/if}
            </div>
        </div>
    </div>
</div>
