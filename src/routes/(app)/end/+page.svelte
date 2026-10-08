<script>
    import { goto } from '\$app/navigation'
</script>

<div class="page-body">
    <div class="page-body-card">
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
