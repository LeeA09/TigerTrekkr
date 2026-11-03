<script>
    import { invalidateAll } from '$app/navigation'
    import { font_size } from '$lib/stores/settings'
    import { enhance } from '$app/forms'
    import { modal } from '$lib/modals'
    import { ShowPasswordIcon, HidePasswordIcon } from '$lib/shared/icons'

    let isSubmitting = $state(false)
    let errorMessage = $state('')

    let showNewPassword = $state(false)
    let showConfirmPassword = $state(false)

    function toggle_new_show_password() { showNewPassword = !showNewPassword; }
    function toggle_new_show_confirm_password() { showConfirmPassword = !showConfirmPassword; }

    // close via esc and click out
    function handle_key_down(event) {
        if (event.key === 'Escape') { modal.close() }
    }
    function handle_backdrop_click(event) {
        if (event.target === event.currentTarget) { modal.close() }
    }

    async function handle_update_password() { 
        isSubmitting = true
        errorMessage = ''

	return async ({ result, update }) => {
		isSubmitting = false
		const data = result.data ?? result
		
		if (data?.success){
			await invalidateAll()
			modal.close()
		} else {
			errorMessage = data?.error ?? 'An error occurred'
			console.log(errorMessage)
		}
	}
    }

</script>

<svelte:window onkeydown={handle_key_down} />

<div class="modal-background" role="dialog" aria-modal="true" tabindex="-1" onkeydown={handle_key_down} onclick={handle_backdrop_click} style={`--font-size: ${$font_size}px`}>
    <div class="modal-card">
        <div class="modal-confirm-header">
	        <button type="button" class="modal-close-button" onclick={() => modal.close()} aria-label="Close">✖</button>
            <h3>Change Password</h3>
        </div>
	    <form method="POST" action="/api/account/update/password" use:enhance={handle_update_password}>
            {#if errorMessage}
                <p class="error-message">{errorMessage}</p>
            {/if}
            <div class="fill-in">
                <label for="current-password">Current password</label>
                <input type="password" name="password" placeholder="Enter current password" required />
            </div>		
	        <div class="fill-in">
                <label for="new-password">New password</label>
                <div class="fill-in-eye">
                    <input name="newPassword" type={showNewPassword ? 'text' : 'password'} placeholder="Enter new password" autocomplete="new-password" required />
                    <button type="button" class="button-eye" onclick={toggle_new_show_password} aria-label={showNewPassword ? 'Hide Password' : 'Show Password'}>
                        {#if showNewPassword}
                            <HidePasswordIcon />
                        {:else}
                            <ShowPasswordIcon />
                        {/if}
                    </button>
                </div>
            </div>
            <div class="fill-in">
                <label for="new-confirm-password">Confirm new password</label>
                <div class="fill-in-eye">
                    <input name="confirmNewPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm password" required />
                    <button type="button" class="button-eye" onclick={toggle_new_show_confirm_password} aria-label={showConfirmPassword ? 'Hide Password' : 'Show Password'}>
                        {#if showConfirmPassword}
                            <HidePasswordIcon />
                        {:else}
                            <ShowPasswordIcon />
                        {/if}
                    </button>
                </div>
            </div>
		    <button class="home-button" disabled={isSubmitting}>Save</button>
		</form>
        
    </div>
</div>
