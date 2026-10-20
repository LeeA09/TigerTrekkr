<script>
    import { goto } from '\$app/navigation'
    import { currentLocIdx, sessionScore, selected_difficulty } from '$lib/stores/game';
    
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
        goto('/play')
    }
</script>

<div class="page-body">
    <div class="page-body-card end-card">
        <div class="page-body-card-buttons">
            <div class="page-body-card-title">
                <h2>-Total Game Score-</h2>
                <h2 style="color: #FFC300">{score} / {max_score}</h2>
            </div>
	    <div style="width: 100%; height: 2px; background-color: #FFFFFF; border-radius: 3px;"></div>
            <button type="button" class="home-button" onclick={startNewGame}>
                Play Again
            </button>
            <button type="button" class="home-button" onclick={() => goto('/difficulty')}>
                Change Difficulty
            </button>
            <button type="button" class="home-button" onclick={() => goto('/')}>
                Exit
            </button>
        </div>
    </div>
</div>
