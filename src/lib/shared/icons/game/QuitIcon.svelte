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
    <path d="
        M 12 9.17 
        L 16.97 4.2
        A 2 2 0 0 1 19.8 7.03
        L 14.83 12
        L 19.8 16.97
        A 2 2 0 0 1 16.97 19.8
        L 12 14.83
        L 7.03 19.8
        A 2 2 0 0 1 4.2 16.97
        L 9.17 12
        L 4.2 7.03
        A 2 2 0 0 1 7.03 4.2
        Z
    " />
</svg>