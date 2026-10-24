import { writable } from 'svelte/store'
import { browser } from '$app/env'

function persistentWritable(key, defaultValue) {
	const initialValue = browser && localStorage.getItem(key)
		? JSON.parse(localStorage.getItem(key))
		: defaultValue;

	const store = writable(initialValue);

	if (browser) {
		store.subscribe((value) => {
			localStorage.setItem(key, JSON.stringify(value))
		})
	}

	return store;
}

// RESET THE IS_MUSIC_ON STATE ON PAGE REFRESH BECAUSE AUDIO DOES NOT/CANNOT AUTO PLAY
// export const is_music_on = persistentWritable('is_music_on', true)
export const is_music_on = writable(false)
export const is_sound_on = persistentWritable('is_sound_on', true)
export const font_size = persistentWritable('font_size', 16)
export const lead_is_collapsed = persistentWritable('lead_is_collapsed', false)
