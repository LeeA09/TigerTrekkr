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
    <circle cx="12" cy="4.5" r="2" />
    <rect x="10" y="9.5" width="4" height="12" rx="2" ry="2" />
</svg>