import { derived, Writable, writable } from 'svelte/store';

export const bigClockUpdate: Writable<number> = writable(0);
export const blink: Writable<boolean> = writable(true);
export const activeStyleId: Writable<number> = writable(null);
export const nextStyleId: Writable<number> = writable(null);
export const visibleStylesId = derived([activeStyleId, nextStyleId], styles => [...styles]);