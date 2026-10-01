<script>
    import { goto, invalidateAll } from '$app/navigation';
    import { font_size } from '$lib/stores/settings';
    import { enhance } from '$app/forms'
    import { modal } from '$lib/modals'

    let isSubmitting = $state(false);
    let errorMessage = $state('');

    let new_show_password = $state(false);
    let new_show_confirm_password = $state(false);

    function toggle_new_show_password() { new_show_password = !new_show_password; }
    function toggle_new_show_confirm_password() { new_show_confirm_password = !new_show_confirm_password; }

    // close via esc and click out
    function handle_key_down(event) {
        if (event.key === 'Escape') {
            modal.close()
        }
    }
    function handle_backdrop_click(event) {
        if (event.target === event.currentTarget) {
            modal.close()
        }
    }

    async function handle_update_password() { 
	isSubmitting = true
	errorMessage = ''

	return async ({ result, update }) => {
	    isSubmitting = false
	    const data = result.data ?? result;
 
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
    <div class="page-body-card modal-card">
        <div class="modal-confirm-header">
	    <button type="button" class="modal-close-button" onclick={() => modal.close()} aria-label="Close help">✖</button>
            <div class="modal-confirm-icon" style="font-size: 38px;">✎</div>
            <h3>Change Password</h3>
	    <form method="POST" action="/api/update-password" use:enhance={handle_update_password}>
		<div class="fill-in">
		    <label for="current-password">Current password</label>
		    <input type="password" name="password" placeholder="Enter current password" required />
		</div>		
	        <div class="fill-in">
                        <label for="new-password">New password</label>
                        <div class="fill-in-eye">
                            <input name="new_password" type={new_show_password ? 'text' : 'password'} placeholder="Enter new password" autocomplete="new-password" required />
                            <button type="button" class="button-eye" onclick={toggle_new_show_password} aria-label={new_show_password ? 'Hide Password' : 'Show Password'}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    {#if new_show_password}
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
                        <label for="new-confirm-password">Confirm new password</label>
                        <div class="fill-in-eye">
                            <input name="new_confirm_password" type={new_show_confirm_password ? 'text' : 'password'} placeholder="Confirm password" required />
                            <button type="button" class="button-eye" onclick={toggle_new_show_confirm_password} aria-label={new_show_confirm_password ? 'Hide Password' : 'Show Password'}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    {#if new_show_confirm_password}
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
		    <button type="submit" class="home-button">Save</button>
		</form>
        </div>
    </div>
</div>
