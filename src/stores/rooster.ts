import { Writable, writable } from 'svelte/store';

export const summoned: Writable<boolean> = writable(false);