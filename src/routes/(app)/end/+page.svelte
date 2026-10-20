<script>
    import { goto } from '\$app/navigation'
    import { currentLocIdx, sessionScore } from '$lib/stores/game';
    
    let score = $sessionScore

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
                <h2 style="color: #FFC300">{score}</h2>
            </div>
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
