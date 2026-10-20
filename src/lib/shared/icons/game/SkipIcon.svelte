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
    <path d="M 3 5.5 Q 3 2.5 5.8 4.7 L 12.2 9.8 Q 15 12 12.2 14.2 L 5.8 19.3 Q 3 21.5 3 18.5 Z" />
    <rect x="17" y="2.5" width="4" height="19" rx="2" ry="2" />
</svg>