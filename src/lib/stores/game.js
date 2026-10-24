import { writable } from 'svelte/store';

export const currentLocIdx = writable(0);
export const currentLocation = writable(null);
export const roundResult = writable(null);
export const sessionLocations = writable([]);
export const timerSeconds = writable(0);
export const is_timer_active = writable(false);
export const selected_difficulty = writable('');
export const sessionScore = writable(0);