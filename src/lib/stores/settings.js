import { writable } from 'svelte/store';

export const is_music_on = writable(true);
export const is_sound_on = writable(true);
export const font_size = writable(16);
export const is_guest = writable(true);
export const selected_difficulty = writable("");