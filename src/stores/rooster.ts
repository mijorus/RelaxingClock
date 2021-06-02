import { Writable, writable } from 'svelte/store';
import type { RoosterShortcuts } from '../types';

export const summoned: Writable<boolean> = writable(false);

export const shortcuts: RoosterShortcuts = {
    state: {
        alarm: {
            set: {
                active: true,
                callback() {
                    console.log('alarm set');
                }
            }
        },
    },

    set(key, value) {
        Object.assign(this.state, { [key]: value });
    },

    getAll() {
        return this.state;
    },

    get(s) {
        return this.state[s];
    }
};