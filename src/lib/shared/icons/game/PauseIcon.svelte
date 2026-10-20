<script>
    let { 
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
>
    <rect x="6" y="2.5" width="4" height="19" rx="2" ry="2" />
    <rect x="14" y="2.5" width="4" height="19" rx="2" ry="2" />
</svg>