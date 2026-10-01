<script lang="ts">

    import '../app.css'
    import { font_size } from '$lib/stores/settings'
    import ModalHost from '$lib/modals/ModalHost.svelte'
    import { invalidate } from '$app/navigation'
    import { onMount } from 'svelte'
    import type { Snippet } from 'svelte'

    let { data, children } = $props();

    onMount(() => {
	const { data: { subscription } } = data.supabase.auth.onAuthStateChange((event, newSession) => {
	    if (newSession?.expires_at !== data.session?.expires_at) {
		invalidate('supabase:auth')
	    }
	})
	
	return () => subscription.unsubscribe()

    })

</script>

<svelte:head>

	<link rel="icon" href=/mascot.png/>

	<title>TigerTrekkr</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Actor&family=Rubik+Vinyl&display=swap"/>
	
</svelte:head>

<div class="app" style={`--font-size: ${$font_size}px`}>
    {@render children()}
    <ModalHost />
</div>

<style>
    .app {
        width: 100%;
        height: 100%;
    }
</style>
