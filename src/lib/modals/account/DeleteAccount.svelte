<script>
    import { goto, refreshAll } from '$app/navigation'
    import { font_size } from '$lib/stores/settings'
    import { modal, DeleteSuccess } from '$lib/modals'
    import { DeleteIcon } from '$lib/shared/icons'

    let isDeleting = $state(false)
    let errorMessage = $state('')

    // close via esc and click out
    function handle_key_down(event) {
        if (event.key === 'Escape') { modal.close() }
    }
    function handle_backdrop_click(event) {
        if (event.target === event.currentTarget) { modal.close() }
    }

    async function handle_delete() {
	    isDeleting = true
	    errorMessage = ''

        try {
            const response = await fetch('/api/account/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
                })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to delete account.')
            }

            await goto('/')
            await refreshAll()

            modal.close()
            modal.close()
            modal.open(DeleteSuccess, {})
        } catch (error) {
            errorMessage = error.message
        } finally {
            isDeleting = false
        }
    }
</script>

<svelte:window onkeydown={handle_key_down} />

<div class="modal-background" role="dialog" aria-modal="true" tabindex="-1" onkeydown={handle_key_down} onclick={handle_backdrop_click} style={`--font-size: ${$font_size}px`}>
    <div class="modal-card">
        <div class="modal-confirm-header">
            <div class="modal-confirm-icon">
                <DeleteIcon />
            </div>
            <h3>Delete Account?</h3>
        </div>
        <p class="modal-confirm-body">
            Are you sure you want to delete your account? This action cannot be undone.
        </p>
        {#if errorMessage}
            <div class="error-banner" role="alert">
                <p>{errorMessage}</p>
            </div>
        {/if}
        <div class="modal-confirm-buttons">
            <button class="button-secondary confirm-delete-button" onclick={handle_delete} disabled={isDeleting}>
                {#if isDeleting}
                    <span class="spinner" aria-hidden="true"></span>
                    <span>Deleting...</span>
                {:else}
                    Delete
                {/if}
            </button>
            <button class="button-secondary" onclick={() => modal.close()} disabled={isDeleting}>
                Cancel
            </button>
        </div>
    </div>
</div>
