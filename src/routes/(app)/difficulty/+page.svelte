<script>
    import { goto } from '\$app/navigation'
    import { is_guest, selected_difficulty } from '$lib/stores/settings'
</script>

<div class="page">
    <div class="page-background">
        <div class="page-body">
            <div class="difficulty-card page-body-card">
                <h2 class="page-body-card-title">Select Difficulty</h2>
                <p class="page-body-card-description">
                {#if $is_guest}
                    Playing as <span class="page-body-card-link">Guest</span>
                {:else}
                    Playing as <span class="page-body-card-link">Username</span>
                {/if}
                </p>
                <div class="difficulty-grid">
                    <button class="difficulty-option" class:selected={$selected_difficulty === 'easy'} onclick={() => ($selected_difficulty = 'easy') }>
                        <span class="difficulty-option-title">Easy</span>
                        <span class="difficulty-option-description">
                            360&deg
                        </span>
                    </button>
                        <button class="difficulty-option" class:selected={$selected_difficulty === 'medium'} onclick={ () => ($selected_difficulty = 'medium') }>
                        <span class="difficulty-option-title">Medium</span>
                        <span class="difficulty-option-description">
                            180&deg
                        </span>
                    </button>
                    <button class="difficulty-option" class:selected={$selected_difficulty === 'hard'} onclick={ () => ($selected_difficulty = 'hard') }>
                        <span class="difficulty-option-title">Hard</span>
                        <span class="difficulty-option-description">
                            0&deg
                        </span>
                    </button>
                </div>
                <div class="difficulty-buttons">
                    <button class="home-button" onclick={() => goto('/play')} disabled={!$selected_difficulty}>
                        Play
                    </button>
                    <button class="button-secondary" onclick={() => goto('/')}>
                        Cancel
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
