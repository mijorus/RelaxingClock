import { readable, Writable, writable } from "svelte/store";

export let screenSaver: Writable<boolean> = writable(false);