<script>
	let { children } = $props();

    import '../app.css'
</script>

<svelte:head>

	<link rel="icon" href=/tiger-trekkr-logo.ico/>

	<title>TigerTrekkr</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Actor&family=Rubik+Vinyl&display=swap"/>
	
</svelte:head>

{@render children()}
