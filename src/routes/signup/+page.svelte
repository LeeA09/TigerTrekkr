<script>

    import { goto } from '\$app/navigation';
    import { enhance } from '$app/forms';
    let { form } = $props();    

    import { onMount } from 'svelte';

    // Animate the background in a figure-8 pattern
    onMount(() => {
        const background = document.querySelector('.background-animation');

        const duration = 80000;
        const startTime = performance.now();

        // @ts-ignore
        function animate(currentTime) {
            const elapsed = (currentTime - startTime) % duration;
            const t = (elapsed / duration) * Math.PI * 2;

            const x = 12 * Math.sin(t);
            const y = 6 * Math.sin(2 * t);

            if (background) {
                // @ts-ignore
                background.style.transform = `scale(2) translate(${x}%, ${y}%)`;
            }

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    });

    // for password eye icon
    let signup_show_password = $state(false);
    let signup_show_confirm_password = $state(false);

    function toggle_signup_show_password() {
        signup_show_password = !signup_show_password;
    }
    function toggle_signup_show_confirm_password() {
        signup_show_confirm_password = !signup_show_confirm_password;
    }

    // checks passwords match before adding user
    let password = $state('');
    let confirmPassword = $state('');

    let passwordsMatch = $derived(password.length > 0 && password === confirmPassword);

</script>

<div class="page">
    <div class="page-background">
        <header class="top-bar">
            <button class="top-bar-home-link" onclick={() => goto('/')} title="Return to Home" aria-label="Return to Home">
                <span class="top-bar-home-title">TigerTrekkr</span>
            </button>
            <div class="button-circle-top">
                <button class="utility-button" title="Settings" aria-label="Settings">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </button>
                <button class="utility-button" title="Help" aria-label="Help">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                </button>
                <button class="utility-button" title="Info" aria-label="Info">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                </button>
            </div>
        </header>
        <div class="page-body">
            <div class="background-animation"></div>
            <div class="background-overlay"></div>
            <div class="page-body-card">
                <h2 class="page-body-card-title">Sign Up</h2>
                <p class="page-body-card-description">
                    Already have an account? Login <a href="/login" class="page-body-card-link">here</a>.
                </p>
                <form method="POST" use:enhance>
                    <div class="fill-in">
                        <label for="username">Username</label>
                        <input name="username" type="text" placeholder="Enter username" required />
                    </div>
                    <div class="fill-in">
                        <label for="email">Email</label>
                        <input name="email" type="email" autocomplete="email" placeholder="Enter email" required />
                    </div>
                    <div class="fill-in">
                        <label for="password">Password</label>
                        <div class="fill-in-eye">
                            <input name="password" type={signup_show_password ? 'text' : 'password'} bind:value={password} autocomplete="new-password" placeholder="Enter password" required />
                            <button class="button-eye" onclick={toggle_signup_show_password} aria-label={signup_show_password ? 'Hide Password' : 'Show Password'}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    {#if signup_show_password}
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
                        <label for="confirm-password">Confirm password</label>
                        <div class="fill-in-eye">
                            <input type={signup_show_confirm_password ? 'text' : 'password'} bind:value={confirmPassword} placeholder="Confirm password" required />
                            <button class="button-eye" onclick={toggle_signup_show_confirm_password} aria-label={signup_show_confirm_password ? 'Hide Password' : 'Show Password'}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    {#if signup_show_confirm_password}
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

		    {#if confirmPassword.length > 0 && !passwordsMatch}
			<p style="color: red;">Passwords do not match.</p>
		    {/if}
			
                    <button type="submit" diabled={!passwordsMatch} class="home-button">Sign Up</button>
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
