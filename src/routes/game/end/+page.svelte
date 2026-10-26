<script>
    import { goto } from '\$app/navigation'
    import { currentLocIdx, sessionScore, selected_difficulty } from '$lib/stores/game';
    import { font_size } from '$lib/stores/settings'
    import { onMount } from 'svelte'
    import { animateBackground } from '$lib/shared/backgroundAnimation'
    import { MainHeader } from '$lib/shared/headers';
    onMount(() => { animateBackground() })
    
    let score = $sessionScore

    const max_scores = {
	easy: 3000,
	medium: 4000,
	hard: 5000
    };

    let max_score = $derived(max_scores[$selected_difficulty] * 3);

    function startNewGame() {
        currentLocIdx.set(0);
        sessionScore.set(0);
        document.cookie = "can_play=true; path=/; SameSite=Strict";
        goto('/game/play')
    }
</script>

<div class="page" style="--app-font-size: {$font_size}px">
    <div class="page-background">
        <MainHeader />
        <div class="page-body">
            <div class="background-animation"></div>
            <div class="background-overlay"></div>
            <div class="page-body-card end-card">
                <div class="page-body-card-buttons">
                    <div class="page-body-card-title">
                        <div class="page-body-title-card">
                            <h2>Total Game Score</h2>
                            <!-- SOME KIND OF BANNER SHOULD GO HERE? -->
                            <h2 style="color: #FFC300">{score} / {max_score}</h2>
                        </div>
                    </div>
                    <div class="end-button">
                        <button type="button" class="home-button" onclick={startNewGame}>
                            Play Again
                        </button>
                        <button type="button" class="home-button" onclick={() => goto('/game/difficulty')}>
                            Change Difficulty
                        </button>
                        <button type="button" class="home-button" onclick={() => goto('/')}>
                            Exit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>