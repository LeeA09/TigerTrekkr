<script>
    import { goto } from '\$app/navigation'
    import { currentLocIdx } from '$lib/stores/game';
     
    function startNewGame() {
        currentLocIdx.set(0);
        document.cookie = "can_play=true; path=/; SameSite=Strict";
        goto('/play')
    }
</script>

<div class="page-body">
    <div class="page-body-card end-card">
        <div class="page-body-card-buttons">
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
