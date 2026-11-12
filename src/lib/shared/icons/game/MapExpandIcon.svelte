<script>
    let { 
        size = "24",
        color = "currentColor",
        expanded = false
    } = $props();
</script>

<svg 
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
>
    {#if expanded}
        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
    {:else}
        <path d="M3 9V3h6M3 3l7 7M21 15v6h-6M21 21l-7-7"></path>
    {/if}
</svg>