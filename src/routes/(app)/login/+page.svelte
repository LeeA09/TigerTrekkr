<script>
    import { goto, invalidateAll } from '\$app/navigation'
    //import { font_size } from '$lib/stores/settings'
    import { enhance } from '$app/forms'

    let { form } = $props()

    let isSubmitting = $state(false)
    let errorMessage = $state('')

    async function handle_login() { 
        isSubmitting = true
        errorMessage = ''

        return async ({ result, update }) => {
            isSubmitting = false
            const data = result.data ?? result

            if (data?.success){ 
                await invalidateAll()
                goto('/')
            } else {
                errorMessage = result.data?.error ?? 'An error occurred'
                console.log(errorMessage)
            }
        }
    }

    // for password eye icon
    let showPassword = $state(false)
    function toggle_show_password() { showPassword = !showPassword }
</script>

<div class="page">
    <div class="page-background">
        <div class="page-body">
            <div class="page-body-card">
                <h2 class="page-body-card-title">Log In</h2>
                <p class="page-body-card-description">
                    Don't have an account? Sign up <a href="/signup" class="page-body-card-link">here</a>.
                </p>
                <form method="POST" action="/api/login" use:enhance={handle_login}>
                    <div class="fill-in">
                        <label for="email">Email</label>
                        <input name="email" type="email" placeholder="Enter email" autocomplete="email" required />
                    </div>
                    <div class="fill-in">
                        <label for="password">Password</label>
                        <div class="fill-in-eye">
                            <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter password" autocomplete="current-password" required />
                            <button type="button" class="button-eye" onclick={toggle_show_password} aria-label={showPassword ? 'Hide Password' : 'Show Password'}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    {#if showPassword}
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                        <line x1="3" y1="3" x2="21" y2="21"></line>
                                    {:else}
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    {/if}
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button type="submit" class="home-button" disabled={isSubmitting}>Submit</button>
                </form>
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
