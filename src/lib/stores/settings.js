import { writable } from 'svelte/store';

export const font_size = writable(16);
export const is_guest = writable(false);
export const selected_difficulty = writable("");