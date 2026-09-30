<script>
    import { is_music_on, is_sound_on, font_size } from '$lib/stores/settings';
    import UpdatePassword from '$lib/modals/account/UpdatePassword.svelte';
    import DeleteAccount from '$lib/modals/account/DeleteAccount.svelte';
    import { goto, invalidateAll } from '$app/navigation';
    import { enhance } from '$app/forms'
    import { page } from '$app/state';

    let { onClose, opaque = false } = $props();

    let user = $derived(page.data?.user);

    // music and sound
    function toggle_music() { is_music_on.update(value => !value); }
    function toggle_sound() { is_sound_on.update(value => !value); }

    // font size
    const MIN_FONT_SIZE = 12;
    const MAX_FONT_SIZE = 20;
    function decrease_text_size() { font_size.update(size => Math.max(MIN_FONT_SIZE, size - 1)); }
    function increase_text_size() { font_size.update(size => Math.min(MAX_FONT_SIZE, size + 1)); }

    let is_editing_username = $state(false)
    let new_username = $state('')
    let is_saving_username = $state(false)
    let username_error = $state('')

    function edit_email() { return }

    function start_editing_username() {
	new_username = user?.user_metadata?.display_name ?? ''
	username_error = ''
	is_editing_username = true
    }

    function cancel_editing_username() {
	is_editing_username = false
    }

    function handle_username_submit() {
	is_saving_username = true
	username_error = ''

	return async ({ result, update }) => {
	    is_saving_username = false

	    const data = result.data ?? result;
	    if (data?.success){
		is_editing_username = false
		await invalidateAll()
	    } else {
		username_error = result.data?.error ?? 'An error occurred'
		console.log(username_error)
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
			onClose();
			goto('/')
		}
	} catch (error) { console.error('Action failed:', error) }
    }


    // delete account confirmation
    let is_delete_account_open = $state(false);
    function open_delete_account() { is_delete_account_open = true; }
    function close_delete_account() { is_delete_account_open = false; }

    let is_update_password_open = $state(false);
    function open_update_password() { is_update_password_open = true; }
    function close_update_password() { is_update_password_open = false; }

    // close via esc and click out
    function handle_key_down(event) {
        if (event.target.tagName === 'INPUT') {
	    return;
	}

	if (event.key === 'Escape') {
            onClose();
        }
    }
    function handle_backdrop_click(event) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }
</script>

<svelte:window onkeydown={handle_key_down} />

<div class="modal-background" class:utility-backdrop={opaque} role="dialog" aria-modal="true" tabindex="-1" onkeydown={handle_key_down} onclick={handle_backdrop_click} style={`--font-size: ${$font_size}px`}>
    <div class="settings-card page-body-card modal-card">
        <button type="button" class="modal-close-button" onclick={onClose} aria-label="Close settings">✖</button>
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
                            <button class="home-button settings-button" onclick={() => goto('/login')}>Log In</button>
                            <button class="home-button settings-button" onclick={() => goto('/signup')}>Sign Up</button>
                        </div>
                    </div>
                {:else}
                    <div class="settings-item settings-account-info">
                        <div class="settings-account-info-row">
                            <span class="settings-label">Username</span>
			    {#if is_editing_username}
				<form method="POST" action="/api/update-account" use:enhance={handle_username_submit} class="settings-input-form">
				    <input type="text" name="new_username" bind:value={new_username} disabled={is_saving_username} class="settings-input-form input-box"/>
				    <button type="submit" class="settings-account-edit-info-button" disabled={is_saving_username} aria-label="Save Username">🖫</button>
				    <button type="button" class="settings-account-edit-info-button" onclick={cancel_editing_username} disabled={is_saving_username} aria-label="Cancel Editing">✖</button>
				</form>
		 	    {:else}                            
				<span class="settings-account-value">{user.user_metadata?.display_name ?? 'Guest User'}</span>
                            	<button class="settings-account-edit-button" onclick={start_editing_username} aria-label="Edit Username">
                                    ✎
                            	</button>
			    {/if}
                        </div>
			{#if username_error}
			    <p class="settings-error">{username_error}</p>
			{/if}
			
                        <div class="settings-account-info-row">
                            <span class="settings-label">Email</span>
                            <span class="settings-account-value">{user.email ?? '-'}</span>
                        </div>
                        <div class="settings-account-info-row">
                            <span class="settings-label">Password</span>
                            <span class="settings-account-value">••••••••</span>
                            <button class="settings-account-edit-button" onclick={open_update_password} aria-label="Change Password">
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
    {#if is_delete_account_open}
        <DeleteAccount onClose={close_delete_account} />
    {/if}
    {#if is_update_password_open}
	<UpdatePassword onClose={close_update_password} />
    {/if}
</div>
