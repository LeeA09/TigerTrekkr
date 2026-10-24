<script lang="ts">
    import { page } from '$app/state'
    import { font_size } from '$lib/stores/settings'
    import { onMount } from 'svelte'
    import { animateBackground } from '$lib/shared/backgroundAnimation'
    onMount(() => { animateBackground() })
</script>

<div class="page" style="--app-font-size: {$font_size}px">
    <div class="page-background">
        <div class="page-body">
            <div class="background-animation"></div>
            <div class="background-overlay"></div>
            <div class="page-body">
                <div class="page-body-card">
                    <h2 class="page-body-card-title">Verification Link Sent</h2>
                    <div class="page-body-card-description">
                        <p>We sent a verification link to</p>
                        {#if page.url.searchParams.get('email')}
                                <h3 style="color: #FFC300">{page.url.searchParams.get('email')}</h3>
                        {:else}
                                <p>your email address.</p>
                        {/if}
                            <p class="page-body-card-description">Please check your inbox and click the link to activate your account.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
