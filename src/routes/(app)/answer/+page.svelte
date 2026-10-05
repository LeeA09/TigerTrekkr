<script>
    import { goto } from '\$app/navigation'
</script>

<div class="page">
    <div class="page-background">
        <div class="page-body">
            <div class="page-body-card">
                <h2 class="page-body-card-title">Answer Screen</h2>
                <p class="page-body-card-description">
                    Show map with guess and answer pins and line between them. Also score, distance, time. Include fun facts and resources available. Also tessa wants top 5 closest guesses leaderboard for that particular location.
                </p>
                <button type="button" class="button-secondary" onclick={() => goto('/end')}>
                    Next
                </button>
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
