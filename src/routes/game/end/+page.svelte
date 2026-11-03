<script>
    import { goto } from '\$app/navigation'
    import { currentLocIdx, sessionScore, sessionResults, selected_difficulty } from '$lib/stores/game';
    import { font_size } from '$lib/stores/settings'
    import { onMount } from 'svelte'
    import { page } from '$app/state';
    import { animateBackground } from '$lib/shared/backgroundAnimation'
    import { MainHeader } from '$lib/shared/headers';
    onMount(() => { animateBackground() })
    
    onMount(() => {
        // Only call save if active user
        if(page.data?.user){
            saveGameResults()
        }
    })

    async function saveGameResults() {
        try {
            const response = await fetch('/api/game/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    rounds: $sessionResults,
                    totalScore: $sessionScore
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error saving game results:', error);
        }
    }

    let score = $sessionScore

    const max_scores = {
        easy: 9000,
        medium: 12000,
        hard: 15000
    };

    let max_score = max_scores[$selected_difficulty];

    function resetGame(){
        currentLocIdx.set(0);
        sessionScore.set(0);
        sessionResults.set([]);
    }

    function startNewGame() {
        resetGame()
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
            <div class="page-body-card end-card">
                <div class="page-body-card-buttons">
                    <div class="page-body-card-title">
                        <div class="page-body-title-card">
                            <h2>Total Game Score</h2>
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