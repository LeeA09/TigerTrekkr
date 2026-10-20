<script>
    let { 
        rotated = false,
        size = "24",
        color = "currentColor" 
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
    class:faq-open={ rotated }
>
    <polyline points="6 9 12 15 18 9"></polyline>
</svg>