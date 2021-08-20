import Spotify from 'spotify-web-api-js'
import time from '../../stores/time';

export const SpotifyClient = new Spotify();
export let tokenTtl: number = undefined;

export function setTokenTtl(date: number) { tokenTtl = date }