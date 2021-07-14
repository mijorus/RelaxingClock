import { SpotifyAuthClient } from '../../lib/spotify/SpotifyAuthClient';
import { SpotifyClient } from '../../lib/spotify/SpotifyClient';
import { spotifyAccessToken, spotifyPlayerStatus, spotifyUserData, track_window } from '../../stores/spotify';
import { createShortcuts } from './shortcuts';

export let player: Spotify.Player;
export let device_id: string;
const authClient = new SpotifyAuthClient(process.env.SPOTIFY_CLIENT_ID);

export async function createNewSpotifyPlayer() {
    console.log('creating spotify player');

    player = new Spotify.Player({
        name: 'Relaxing Clock',
        getOAuthToken: async (callback) => {
            let response;
            //We request a token for the first time
            if (localStorage.getItem('code') && localStorage.getItem('verifier')) {
                response = await authClient.requestToken(localStorage.getItem('code'), process.env.SPOTIFY_REDIRECT_URL, localStorage.getItem('verifier'));
                localStorage.removeItem('verifier');
            }
            
            else if (localStorage.getItem('refreshToken')) {
                //We need to request a new token using refreshToken
                try { 
                    response = await authClient.refreshToken(localStorage.getItem('refreshToken'));
                } catch(err) {
                    console.error(err);
                    if (err.status === 400 && err.data.error === 'invalid_grant') spotifyPlayerStatus.set('expired');
                    throw err;
                }
            }
            
            localStorage.removeItem('code');
            localStorage.setItem('refreshToken', response.refresh_token);
            SpotifyClient.setAccessToken(response.access_token);
            spotifyAccessToken.set(response.access_token);
            callback(response.access_token);
        }
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    if (!await player.connect()) {
        throw 'Failed to connect to the Spotify Player';
    } 

    player.addListener('ready', (state) => {
        device_id = state.device_id;
        console.log('Ready with Device ID', device_id);
        spotifyPlayerStatus.set('ready');
        createShortcuts();
    });

    player.addListener('player_state_changed', (state) => {
        track_window.set({...state.track_window});
    });
}

