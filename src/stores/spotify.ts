import { readable, Readable,  Writable, writable } from 'svelte/store';

export const spotifyUrl: Writable<string> = writable(undefined);