import { Writable, writable } from 'svelte/store';

export const screenSaver: Writable<boolean> = writable(false);
// prevent style change until the lock is released
export const styleChangeLock: Writable<boolean> = writable(false);