import { derived, Writable, writable } from 'svelte/store';

export const activeStyleId: Writable<number> = writable(null);
export const nextStyleId: Writable<number> = writable(null);
export const visibleStylesId = derived([activeStyleId, nextStyleId], styles => [...styles]);