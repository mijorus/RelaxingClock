import { readable, Readable, Subscriber, Writable, writable } from 'svelte/store';
import type { Tip } from '../types';

export const screenSaver: Writable<boolean> = writable(false);
// prevent style change until the lock is released
export const styleChangeLock: Writable<boolean> = writable(false);
// the source of the background image of the clock
export const mainBgSource: Writable<string> = writable(null);
// check online status
export const onlineStatus: Readable<boolean> = readable(true, (set: Subscriber<boolean>) => {
    window.addEventListener('online', setOnlineStatus);
    window.addEventListener('offline', setOfflineStatus);

    function setOnlineStatus() {
        set(true);
    }

    function setOfflineStatus() {
        set(false);
    }

    return () => {
        window.removeEventListener('online', setOnlineStatus);
        window.removeEventListener('online', setOfflineStatus);
    };
});
// tips
export const tips: Writable<Array<Tip>> = writable(null);
export const alarmIsRinging: Writable<boolean> = writable(false);