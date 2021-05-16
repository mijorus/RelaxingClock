import { readable, Writable, writable } from 'svelte/store';
import type { ClockElementBox } from '../types';

export const bigClockUpdate: Writable<number> = writable(0);
export const blink: Writable<boolean> = writable(true);

export const hoursBox: Writable<ClockElementBox> = writable({x: '', y: '', visible: true, el: undefined});
export const minutesBox: Writable<ClockElementBox> = writable({x: '', y: '', visible: true, el: undefined});
export const secondsBox: Writable<ClockElementBox> = writable({x: '', y: '', visible: true, el: undefined}); 