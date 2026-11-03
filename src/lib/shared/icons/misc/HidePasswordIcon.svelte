<script>
    let { color = "currentColor" } = $props();
</script>

<svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round"
>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
    <line x1="3" y1="3" x2="21" y2="21"></line>
</svg>