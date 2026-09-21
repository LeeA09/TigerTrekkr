<script lang="ts">
	// import favicon from '$lib/assets/favicon.svg';

	// import favicon from '$static/rubber-duck.ico';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/rubber-duck.ico" />
</svelte:head>

{@render children()}
