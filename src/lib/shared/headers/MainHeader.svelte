<script>
    import { goto } from '\$app/navigation'
    import Utilities from './Utilities.svelte';

    let { home } = $props();
</script>

<header class="top-bar">
    <button class="top-bar-home-link" onclick={home} title="Return to Home" aria-label="Return to Home">
        <span class="top-bar-home-title">TigerTrekkr</span>
    </button>
    <div class="button-circle-top"><Utilities /></div>
</header>

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