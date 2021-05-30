import { Writable, writable } from 'svelte/store';
import type { SpotifyPlayerStatus } from '../types';

export const spotifyUrl: Writable<string> = writable(undefined);
export const spotifyPlayerStatus: Writable<SpotifyPlayerStatus> = writable('disconnected');