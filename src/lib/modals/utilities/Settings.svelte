<script>
    import { is_music_on, is_sound_on, font_size } from '$lib/stores/settings'
    import { goto, invalidateAll } from '$app/navigation'
    import { enhance } from '$app/forms'
    import { page } from '$app/state'
    import { modal } from '$lib/modals'
    import DeleteAccount from '../account/DeleteAccount.svelte'
    import UpdatePassword from '../account/UpdatePassword.svelte'

    let { opaque = false } = $props()
    let user = $derived(page.data?.user);

    // music and sound
    function toggle_music() { is_music_on.update(value => !value); }
    function toggle_sound() { is_sound_on.update(value => !value); }

    // font size
    const MIN_FONT_SIZE = 12;
    const MAX_FONT_SIZE = 20;
    function decrease_text_size() { font_size.update(size => Math.max(MIN_FONT_SIZE, size - 1)); }
    function increase_text_size() { font_size.update(size => Math.min(MAX_FONT_SIZE, size + 1)); }

    let isEditingUsername = $state(false)
    let newUsername = $state('')
    let isSavingUsername = $state(false)
    let usernameError = $state('')

    function start_editing_username() {
	    newUsername = user?.user_metadata?.display_name ?? ''
	    usernameError = ''
	    isEditingUsername = true
    }

    function cancel_editing_username() { isEditingUsername = false }

    function handle_username_submit() {
        isSavingUsername = true
        usernameError = ''

        return async ({ result, update }) => {
            isSavingUsername = false
            const data = result.data ?? result

            if (data?.success){
                isEditingUsername = false
                await invalidateAll()
            } else {
                usernameError = result.data?.error ?? 'An error occurred'
                console.log(usernameError)
	        }
	    }
    }

    async function handle_logout() {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })

            const result = await response.json()

            if(response.ok) {
                await invalidateAll();
                modal.close();
                goto('/')
            }
        } catch (error) { console.error('Action failed:', error) }
    }

    function open_delete_account() { modal.open(DeleteAccount, { }) }
    function open_change_password() { modal.open(UpdatePassword, { }) }

    function login_redirect() {
        modal.close();
        goto('/login');
    }

    function sign_up_redirect() {
        modal.close();
        goto('/signup');
    }

    function handle_key_down(event) {
	if (event.target.tagName === 'INPUT') { return; }
	if (event.key === 'Escape') { modal.close(); }
    }
    function handle_backdrop_click(event) {
	if (event.target === event.currentTarget) { modal.close(); }
    }
</script>

<svelte:window onkeydown={handle_key_down} />

<div class="modal-background" class:utility-backdrop={opaque} role="dialog" aria-modal="true" tabindex="-1" onkeydown={handle_key_down} onclick={handle_backdrop_click} style={`--font-size: ${$font_size}px`}>
    <div class="settings-card page-body-card modal-card">
        <button type="button" class="modal-close-button" onclick={() => modal.close()} aria-label="Close settings">✖</button>
	<h2>Settings</h2>
        <div class="settings-grid">
            <div class="settings-section">
                <h3>Audio & Display</h3>
                <div class="settings-item">
                    <span class="settings-label">Music</span>
                    <button class="button-toggle" class:active={$is_music_on} onclick={toggle_music}>
                        {$is_music_on ? 'ON' : 'OFF'}
                    </button>
                </div>
                <div class="settings-item">
                    <span class="settings-label">Sound</span>
                    <button class="button-toggle" class:active={$is_sound_on} onclick={toggle_sound}>
                        {$is_sound_on ? 'ON' : 'OFF'}
                    </button>
                </div>
                <div class="settings-item">
                    <span class="settings-label">Font Size</span>
                    <div class="settings-font-grid">
                        <button class="settings-font-button" onclick={decrease_text_size} disabled={$font_size === MIN_FONT_SIZE}>
                            A-
                        </button>
                        <button class="settings-font-button" onclick={increase_text_size} disabled={$font_size === MAX_FONT_SIZE}>
                            A+
                        </button>
                    </div>
                </div>
            </div>
            <div class="settings-section">
                <h3>Account Information</h3>
		        {#if !user}
                <div class="settings-item settings-account-info">
                    <p>You are playing as a guest. Log in to track your score on the leaderboard.</p>
                    <div class="settings-account-buttons">
                        <button class="home-button settings-button" onclick={login_redirect}>Log In</button>
                        <button class="home-button settings-button" onclick={sign_up_redirect}>Sign Up</button>
                    </div>
                </div>
                {:else}
                <div class="settings-item settings-account-info">
                    <div class="settings-account-info-row">
                        <span class="settings-label">Username</span>
			    {#if isEditingUsername}
				<form method="POST" action="/api/update-account" use:enhance={handle_username_submit} class="settings-input-form">
				    <input type="text" name="newUsername" bind:value={newUsername} disabled={isSavingUsername} class="settings-input-form input-box"/>
				    <button type="submit" class="settings-account-edit-info-button" disabled={isSavingUsername} aria-label="Save Username">✔</button>
				    <button type="button" class="settings-account-edit-info-button" onclick={cancel_editing_username} disabled={isSavingUsername} aria-label="Cancel Editing">✖</button>
				</form>
		 	    {:else}                            
				<span class="settings-account-value">{user.user_metadata?.display_name ?? 'Guest User'}</span>
                    <button class="settings-account-edit-button" onclick={start_editing_username} aria-label="Edit Username">
                        ✎
                    </button>
			    {/if}
                        </div>
			{#if usernameError}
			    <p class="settings-error">{usernameError}</p>
			{/if}
                        <div class="settings-account-info-row">
                            <span class="settings-label">Email</span>
                            <span class="settings-account-value">{user.email ?? '-'}</span>
                            <button class="settings-account-edit-button fake-button">
                                ✎
                            </button>
                        </div>
                        <div class="settings-account-info-row">
                            <span class="settings-label">Password</span>
                            <span class="settings-account-value">••••••••</span>
                            <button class="settings-account-edit-button" onclick={open_change_password} aria-label="Change Password">
                                ✎
                            </button>
                        </div>
                        <div class="settings-account-buttons">
                            <button class="button-secondary settings-delete-button" onclick={open_delete_account}>Delete Account</button>
			    <button class="button-secondary settings-button" onclick={handle_logout}>Log Out</button>
			</div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
