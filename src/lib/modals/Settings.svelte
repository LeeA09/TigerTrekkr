<script>
    import { is_music_on, is_sound_on, font_size } from '$lib/stores/settings';
    import DeleteAccount from '$lib/modals/DeleteAccount.svelte';
    import { goto, invalidateAll } from '$app/navigation';

    import { page } from '$app/state';

    let { onClose, opaque = false } = $props();

    let user = $derived(page.data?.user);
    let supabase = $derived(page.data?.supabase);

    // music and sound
    function toggle_music() { is_music_on.update(value => !value); }
    function toggle_sound() { is_sound_on.update(value => !value); }

    // font size
    const MIN_FONT_SIZE = 12;
    const MAX_FONT_SIZE = 20;
    function decrease_text_size() { font_size.update(size => Math.max(MIN_FONT_SIZE, size - 1)); }
    function increase_text_size() { font_size.update(size => Math.min(MAX_FONT_SIZE, size + 1)); }

    async function logout() {
	if(!supabase) return;
	const { error } = await supabase.auth.signOut();
	if (error) {
	    console.error('Error logging out:', error.message);
	    return;
	}
	await invalidateAll();

	onClose();
	goto('/');
    }


    // delete account confirmation
    let is_delete_account_open = $state(false);
    function open_delete_account() { is_delete_account_open = true; }
    function close_delete_account() { is_delete_account_open = false; }

    // close via esc and click out
    function handle_key_down(event) {
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
                            <span class="settings-account-value">{user.user_metadata?.display_name ?? 'Guest User'}</span>
                            <button class="settings-account-edit-button" onclick={edit_username} aria-label="Edit Username">
                                ✎
                            </button>
                        </div>
                        <div class="settings-account-info-row">
                            <span class="settings-label">Email</span>
                            <span class="settings-account-value">{user.email ?? '-'}</span>
                            <button class="settings-account-edit-button" onclick={edit_email} aria-label="Edit Email">
                                ✎
                            </button>
                        </div>
                        <div class="settings-account-info-row">
                            <span class="settings-label">Password</span>
                            <span class="settings-account-value">••••••••</span>
                            <button class="settings-account-edit-button" onclick={edit_password} aria-label="Change Password">
                                ✎
                            </button>
                        </div>
                        <div class="settings-account-buttons">
                            <button class="button-secondary settings-delete-button" onclick={open_delete_account}>Delete Account</button>
                            <button class="button-secondary settings-button" onclick={logout}>Log Out</button>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
        <button class="button-secondary" onclick={onClose}>
            Close
        </button>
    </div>
    {#if is_delete_account_open}
        <DeleteAccount onClose={close_delete_account} />
    {/if}
</div>
