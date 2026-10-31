<script>
    import { goto } from '\$app/navigation'
    import { enhance } from '$app/forms'
    import { font_size } from '$lib/stores/settings'
    import { onMount } from 'svelte'
    import { MainHeader } from '$lib/shared/headers'
    import { animateBackground } from '$lib/shared/backgroundAnimation'
    onMount(() => { animateBackground() })

    let isSubmitting = $state(false)
    let errorMessage = $state('')

    // for password eye icon
    let showPassword = $state(false)
    let showConfirmPassword = $state(false)
    function toggle_show_password() { showPassword = !showPassword }
    function toggle_show_confirm_password() { showConfirmPassword = !showConfirmPassword }

    const handle_signup = ({ formData, cancel }) => {
        const password = formData.get('password')
        const confirmPassword = formData.get('confirmPassword')

        // Check if passwords match before hitting the server
        if (password !== confirmPassword) {
            cancel() // Stops the form submission completely
            isSubmitting = false
            errorMessage = 'Error: Passwords do not match.'
            console.log(errorMessage)
            return
        }

        isSubmitting = true
        errorMessage = ''

        // Return the callback for handling the server response
        return async ({ result }) => {
            isSubmitting = false
            const data = result.data ?? result

            if (data?.success) {
                const email = data?.email
                document.cookie = "sign_up=true; path=/; SameSite=Strict";
                await goto(`/check-email?email=${encodeURIComponent(email)}`)
            } else {
                errorMessage = 'Error: ' + (data?.error ?? 'An error occurred')
                console.log(errorMessage)
            }
        }
    }
</script>

<div class="page" style="--app-font-size: {$font_size}px">
    <div class="page-background">
        <MainHeader home={() => goto('/')}/>
        <div class="page-body">
            <div class="background-animation"></div>
            <div class="background-overlay"></div>
            <div class="page-body">
                <div class="page-body-card">
                    <h2 class="page-body-card-title">Sign Up</h2>
                    <p class="page-body-card-description">
                        Already have an account? Login <a href="/login" class="page-body-card-link">here</a>.
                    </p>
                    <form method="POST" action="/api/account/signup" use:enhance={handle_signup}>
                        {#if errorMessage}
                            <p class="error-message">{errorMessage}</p>
                        {/if}
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
        </div>
    </div>
</div>