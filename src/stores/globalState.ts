import { readable, Writable, writable } from "svelte/store";

export let screenSaver: Writable<boolean> = writable(false);
// prevent style change until the lock is released
export let styleChangeLock: Writable<boolean> = writable(false);