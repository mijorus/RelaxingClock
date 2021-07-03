import { Writable, writable } from 'svelte/store';
import type { RoosterShortcuts } from '../types';
import { clockFormat } from './storedSettings';

export const summoned: Writable<boolean> = writable(false);
export const canBeSummoned: Writable<boolean> = writable(true);

export const shortcuts: RoosterShortcuts = {
    state: {
        alarm: {
            color: process.env.BACKGROUND_DARK, 
            background: 'red',
            arguments: {
                set: {
                    active: true,
                    async callback() {
                        console.log('alarm set');
                        return true;
                    }
                }
            }
        },
        clock: {
            color: process.env.BACKGROUND_DARK, 
            background: 'white',
            arguments: {
                format: {
                    async callback(p) {
                        if (p === '12h' || p === '24h') {
                            clockFormat.set(p);
                            return true;
                        }

                        return false;
                    }
                }
            },
            async examples() {
                return [{ argument: 'format', 'example': '12h or 24h', 'tip': 'change the format of the clock'}]
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