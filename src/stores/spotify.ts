import { Writable, writable } from 'svelte/store';
import type { SpotifyPlayerStatus } from '../types';

export const spotifyUrl: Writable<string> = writable(undefined);
export const spotifyAccessToken: Writable<string> = writable(undefined);
export const spotifyPlayerStatus: Writable<SpotifyPlayerStatus> = writable('disconnected');
export const spotifyUserData: Writable<SpotifyApi.CurrentUsersProfileResponse> = writable(undefined);
export const spotifyPlayerState: Writable<Spotify.PlaybackState> = writable(undefined);
export const inQueue: Writable<string> = writable(undefined);