<script>
    import { goto } from '\$app/navigation'
    import { enhance } from '$app/forms'
    //import { font_size } from '$lib/stores/settings'

    let isSubmitting = $state(false)
    let errorMessage = $state('')

    // for password eye icon
    let showPassword = $state(false)
    let showConfirmPassword = $state(false)
    function toggle_show_password() { showPassword = !showPassword }
    function toggle_show_confirm_password() { showConfirmPassword = !showConfirmPassword }

    async function handle_signup() { 
        isSubmitting = true
        errorMessage = ''

        return async ({ result, update }) => {
            isSubmitting = false
            const data = result.data ?? result

            if (data?.success){
                const email = data?.email
                await goto(`/check-email?email=${encodeURIComponent(email)}`)
            } else {
                errorMessage = result.data?.error ?? 'An error occurred'
                console.log(errorMessage)
            }
        }
    }
</script>

<div class="page-body">
    <div class="page-body-card">
        <h2 class="page-body-card-title">Sign Up</h2>
        <p class="page-body-card-description">
            Already have an account? Login <a href="/login" class="page-body-card-link">here</a>.
        </p>
        <form method="POST" action="/api/signup" use:enhance={handle_signup}>
            <div class="fill-in">
                <label for="signup-username">Username</label>
                <input name="username" type="text" placeholder="Enter username" required />
            </div>
            <div class="fill-in">
                <label for="signup-email">Email</label>
                <input name="email" type="email" placeholder="Enter email" autocomplete="email" required />
            </div>
            <div class="fill-in">
                <label for="signup-password">Password</label>
                <div class="fill-in-eye">
                    <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter password" autocomplete="new-password" required />
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
            <div class="fill-in">
                <label for="signup-confirm-password">Confirm password</label>
                <div class="fill-in-eye">
                    <input name="confirmPassword"type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm password" required />
                    <button type="button" class="button-eye" onclick={toggle_show_confirm_password} aria-label={showConfirmPassword ? 'Hide Password' : 'Show Password'}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            {#if showConfirmPassword}
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