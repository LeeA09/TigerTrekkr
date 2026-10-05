<script>
    import { goto } from '\$app/navigation'
</script>

<div class="page">
    <div class="page-background">
        <div class="page-body">
            <div class="page-body-card">
                <h2 class="page-body-card-title">End Screen</h2>
                <p class="page-body-card-description">
                    I guess this background will pretty much remain the same, idk what else needs to go here besides the three buttons i already have.
                </p>
                <div class="page-body-card-buttons">
                    <button type="button" class="button-secondary" onclick={() => goto('/play')}>
                        Play Again
                    </button>
                    <button type="button" class="button-secondary" onclick={() => goto('/difficulty')}>
                        Change Difficulty
                    </button>
                    <button type="button" class="button-secondary" onclick={() => goto('/')}>
                        Exit
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    :global(html),
    :global(body) {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
        font-family: "Actor", sans-serif;
    }
</style>
