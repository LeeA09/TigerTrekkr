<script>
    import { MainHeader } from '$lib/shared/headers'
    import { goto } from '\$app/navigation'
    import { page } from '$app/state'
    import { selected_difficulty, currentLocIdx, sessionScore } from '$lib/stores/game'
    import { font_size } from '$lib/stores/settings'
    import { onMount } from 'svelte';
    import { animateBackground } from '$lib/shared/backgroundAnimation'
    onMount(() => { animateBackground() })
    
    let user_info = $derived(page.data?.userdata);
    let user = $derived(page.data?.user);

    onMount(() => { selected_difficulty.set('') })

    function startNewGame() {
        currentLocIdx.set(0)
        sessionScore.set(0)
        document.cookie = "can_play=true; path=/; SameSite=Strict";
        goto('/game/play')
    }
</script>

<div class="page" style="--app-font-size: {$font_size}px">
    <div class="page-background">
        <MainHeader home={() => goto('/')}/>
        <div class="page-body">
            <div class="background-animation"></div>
            <div class="background-overlay"></div>
            <div class="difficulty-card page-body-card">
                <h2 class="page-body-card-title">Select Difficulty</h2>
                <p class="page-body-card-description">
                {#if !user}
                    Playing as <span class="page-body-card-link">Guest</span>
                {:else}
                    Playing as <span class="page-body-card-link">{user_info?.username ?? 'User'}</span>
                {/if}
                </p>
                <div class="difficulty-grid">
                    <button class="difficulty-option" class:selected={$selected_difficulty === 'easy'} onclick={() => ($selected_difficulty = 'easy') }>
                        <span class="difficulty-option-title">Easy</span>
                        <span class="difficulty-option-description">360&deg view</span>
                        <span class="difficulty-option-description">Max 3000 Points</span>
                    </button>
                    <button class="difficulty-option" class:selected={$selected_difficulty === 'medium'} onclick={ () => ($selected_difficulty = 'medium') }>
                        <span class="difficulty-option-title">Medium</span>
                        <span class="difficulty-option-description">180&deg view</span>
                        <span class="difficulty-option-description">Max 4000 Points</span>
                    </button>
                    <button class="difficulty-option" class:selected={$selected_difficulty === 'hard'} onclick={ () => ($selected_difficulty = 'hard') }>
                        <span class="difficulty-option-title">Hard</span>
                        <span class="difficulty-option-description">0&deg view</span>
                        <span class="difficulty-option-description">Max 5000 Points</span>
                    </button>
                </div>
                <div class="difficulty-buttons">
                    <button class="home-button" onclick={startNewGame} disabled={!$selected_difficulty}>
                        Play
                    </button>
                    <button class="button-secondary" onclick={() => goto('/')}>
                        Exit
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>