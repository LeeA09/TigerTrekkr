<script>
    let { 
        rotated = false,
        size = "24",
        color = "currentColor" 
    } = $props();
</script>

<svg
    class="chevron"
    class:rotated={rotated}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    stroke={color}
    stroke-width="2"
    fill="none"
>
    <polyline points="9 18 15 12 9 6"></polyline>
</svg>