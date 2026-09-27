<script>
    import { goto } from '\$app/navigation';

    import { font_size } from '$lib/stores/settings';

    import Settings from '$lib/modals/settings.svelte';
    import Help from '$lib/modals/Help.svelte';
    import Info from '$lib/modals/Info.svelte';

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
    function toggle_signup_show_password() { signup_show_password = !signup_show_password; }
    function toggle_signup_show_confirm_password() { signup_show_confirm_password = !signup_show_confirm_password; }

    // utility modals
    let is_settings_open = $state(false);
    let is_help_open = $state(false);
    let is_info_open = $state(false);
    function open_settings() { is_settings_open = true; }
	function close_settings() { is_settings_open = false; }
	function open_help() { is_help_open = true; }
	function close_help() { is_help_open = false; }
	function open_info() { is_info_open = true; }
	function close_info() { is_info_open = false; }
</script>

<div class="page">
    <div class="page-background">
        <header class="top-bar">
            <button class="top-bar-home-link" onclick={goto('/')} title="Return to Home" aria-label="Return to Home">
                <span class="top-bar-home-title">TigerTrekkr</span>
            </button>
            <div class="button-circle-top">
                <button class="utility-button" title="Settings" aria-label="Settings" onclick={open_settings}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="
                            M 12 2.5
                            C 14.66 2.5, 13.13 5.66, 14.69 6.41 
                            C 16.25 7.17, 17.77 4, 19.43 6.08 
                            C 21.09 8.16, 17.66 8.93, 18.04 10.62 
                            C 18.43 12.31, 21.85 11.52, 21.26 14.11 
                            C 20.67 16.71, 17.93 14.51, 16.85 15.87 
                            C 15.76 17.22, 18.52 19.41, 16.12 20.56 
                            C 13.73 21.71, 13.74 18.2, 12 18.2 
                            C 10.26 18.2, 10.27 21.71, 7.88 20.56 
                            C 5.48 19.41, 8.24 17.22, 7.15 15.87 
                            C 6.07 14.51, 3.33 16.71, 2.74 14.11 
                            C 2.15 11.52, 5.57 12.31, 5.96 10.62 
                            C 6.34 8.93, 2.91 8.16, 4.57 6.08 
                            C 6.23 4, 7.75 7.17, 9.31 6.41 
                            C 10.87 5.66, 9.34 2.5, 12 2.5 
                            Z
                        "></path>
                    </svg>
                </button>
                <button class="utility-button" title="Help" aria-label="Help" onclick={open_help}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="
                            M 6.5 8.5
                            C 6.5 4.7, 8.9 2, 12 2
                            C 15.5 2, 18.5 4.7, 18.5 8
                            C 18.5 11.2, 16.7 13, 14.5 14.5
                            C 13.5 15.2, 12.8 15.5, 12 15.5
                            C 11.2 15.5, 10.5 15.0, 10.5 14.2
                            C 10.5 13.3, 11.2 12.6, 12.8 12
                            C 14.5 10.9, 15.5 9.8, 15.5 8
                            C 15.5 6.2, 14.1 5, 12.2 5
                            C 10.3 5, 9.5 6.4, 9.5 8.5
                            C 9.5 9.1, 9 9.5, 8 9.5
                            C 7 9.5, 6.5 9.1, 6.5 8.5
                            Z
                        " />
                        <circle cx="12" cy="20" r="1.8" />
                    </svg>
                </button>
                <button class="utility-button" title="Info" aria-label="Info" onclick={open_info}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="4.5" r="2" />
                        <rect x="10" y="9.5" width="4" height="12" rx="2" ry="2" />
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
                <form>
                    <div class="fill-in">
                        <label for="signup-username">Username</label>
                        <input type="text" placeholder="Enter username" required />
                    </div>
                    <div class="fill-in">
                        <label for="signup-email">Email</label>
                        <input type="email" placeholder="Enter email" required />
                    </div>
                    <div class="fill-in">
                        <label for="signup-password">Password</label>
                        <div class="fill-in-eye">
                            <input type={signup_show_password ? 'text' : 'password'} placeholder="Enter password" required />
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
                        <label for="signup-confirm-password">Confirm password</label>
                        <div class="fill-in-eye">
                            <input type={signup_show_confirm_password ? 'text' : 'password'} placeholder="Confirm password" required />
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
                    <button type="submit" class="home-button">Submit</button>
                </form>
            </div>
        </div>
    </div>
    {#if is_settings_open}
        <Settings onClose={close_settings} />
    {/if}
    {#if is_help_open}
        <Help onClose={close_help} />
    {/if}
    {#if is_info_open}
        <Info onClose={close_info} />
    {/if}
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