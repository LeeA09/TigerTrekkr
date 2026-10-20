<script>
    let { 
        size = "24",
        color = "currentColor" 
    } = $props();
</script>

<svg 
    class="leaderboard-icon"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
>
    <polygon points="12 2 12.8 3.8 15 4 13.3 5.4 13.9 7.6 12 6.4 10.1 7.6 10.7 5.4 9 4 11.2 3.8"></polygon>
    <path d="M 2 20 h 20 M 3 20 v -7 h 5 v -4 h 8 v 7 h 5 v 4 M 8 13 v 7 M 16 16 v 4"></path>
</svg>