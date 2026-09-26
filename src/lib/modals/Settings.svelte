<script>
    import { font_size, is_guest } from '$lib/stores/settings';

    import DeleteAccount from '$lib/modals/DeleteAccount.svelte';

    let { onClose } = $props();

    // music and sound
    let is_sound_on = $state(true);
    let is_music_on = $state(true);
    function toggle_music() { is_music_on = !is_music_on; }
	function toggle_sound() { is_sound_on = !is_sound_on; }

    // font size
    const MIN_FONT_SIZE = 12;
    const MAX_FONT_SIZE = 20;
    function decrease_text_size() { font_size.update(size => Math.max(MIN_FONT_SIZE, size - 1)); }
    function increase_text_size() { font_size.update(size => Math.min(MAX_FONT_SIZE, size + 1)); }

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

<div class="modal-background" role="dialog" aria-modal="true" tabindex="-1" onkeydown={handle_key_down} onclick={handle_backdrop_click} style={`--font-size: ${$font_size}px`}>
    <div class="settings-card page-body-card modal-card">
        <h2>Settings</h2>
        <div class="settings-grid">
            <div class="settings-section">
                <h3>Audio & Display</h3>
                <div class="settings-item">
                    <span class="settings-label">Music</span>
                    <button class="button-toggle" class:active={is_music_on} onclick={toggle_music}>
                        {is_music_on ? 'ON' : 'OFF'}
                    </button>
                </div>
                <div class="settings-item">
                    <span class="settings-label">Sound</span>
                    <button class="button-toggle" class:active={is_sound_on} onclick={toggle_sound}>
                        {is_sound_on ? 'ON' : 'OFF'}
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