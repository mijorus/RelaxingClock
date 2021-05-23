import { readable, Readable, Subscriber, Writable, writable } from 'svelte/store';

export const screenSaver: Writable<boolean> = writable(false);
// prevent style change until the lock is released
export const styleChangeLock: Writable<boolean> = writable(false);
// the source of the background image of the clock
export const mainBgSource: Writable<string> = writable(null);
//
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
