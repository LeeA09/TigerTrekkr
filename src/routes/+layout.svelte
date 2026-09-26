<script>
	let { children } = $props();

    import '../app.css'
    import { font_size } from '$lib/stores/settings';
</script>

<svelte:head>

	<link rel="icon" href=/tiger-trekkr-logo.ico/>

	<title>TigerTrekkr</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Actor&family=Rubik+Vinyl&display=swap"/>
	
</svelte:head>

<div class="app" style={`--font-size: ${$font_size}px`}>
    {@render children()}
</div>

<style>
    .app {
        width: 100%;
        height: 100%;
    }
</style>
