<script lang="ts">
    import { page } from '$app/state'
</script>

<div class="page">
    <div class="page-background">
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

<style>
    :global(html),
    :global(body) {
	margin: 0;
	padding: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	box-sizing: border-box;
	font-family: "Actor", sans-serif;
    }
</style>
