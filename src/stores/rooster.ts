import { Writable, writable } from 'svelte/store';
import type { RoosterShortcuts } from '../types';

export const summoned: Writable<boolean> = writable(false);

export const shortcuts: RoosterShortcuts = {
    state: {
        alarm: {
            color: process.env.BACKGROUND_DARK, 
            background: 'red',
            arguments: {
                set: {
                    active: true,
                    callback() {
                        console.log('alarm set');
                    }
                }
            }
        },
        reminder: {
            background: '#57ceff',
            arguments: {
                create: {
                    active: true,
                    callback(p) {
                        console.log('reminder created!', p);
                    }
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