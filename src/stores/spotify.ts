import { Writable, writable } from 'svelte/store';
import type { SpotifyPlayerStatus } from '../types';

export const spotifyUrl: Writable<string> = writable(undefined);
export const spotifyAccessToken: Writable<string> = writable(undefined);
export const spotifyPlayerStatus: Writable<SpotifyPlayerStatus> = writable('disconnected');
export const spotifyUserData: Writable<SpotifyApi.CurrentUsersProfileResponse> = writable(undefined);