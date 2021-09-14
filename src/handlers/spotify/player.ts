import { SpotifyAuthClient } from '../../lib/spotify/SpotifyAuthClient';
import { SpotifyClient } from '../../lib/spotify/SpotifyClient';
import { spotifyAccessToken, spotifyPlayerState, spotifyPlayerStatus } from '../../stores/spotify';
import { autoRefeshToken, refreshingToken } from './login';
import { createShortcuts } from './shortcuts';

export let SpotifyPlayer: Spotify.Player;
export let device_id: string;
const authClient = new SpotifyAuthClient(process.env.SPOTIFY_CLIENT_ID);

export async function refershOrGetOAuthToken() {
    let response;
    refreshingToken.set(true);
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
    if (response.expires_in) autoRefeshToken(response.expires_in);
    SpotifyClient.setAccessToken(response.access_token);
    spotifyAccessToken.set(response.access_token);
    refreshingToken.set(false);
    return response.access_token;
}

export async function createNewSpotifyPlayer() {
    console.log('creating spotify player');

    SpotifyPlayer = new Spotify.Player({
        name: 'Relaxing Clock',
        getOAuthToken: async (callback) => {
            const access_token = await refershOrGetOAuthToken().catch((e) => console.error(e));
            callback(access_token);
        }
    });

    // Error handling
    SpotifyPlayer.addListener('initialization_error', ({ message }) => { console.error(message); });
    SpotifyPlayer.addListener('authentication_error', ({ message }) => { console.error(message); });
    SpotifyPlayer.addListener('account_error', ({ message }) => { console.error(message); });
    SpotifyPlayer.addListener('playback_error', ({ message }) => { console.error(message); });

    if (!await SpotifyPlayer.connect()) {
        throw 'Failed to connect to the Spotify Player';
    } 

    SpotifyPlayer.addListener('ready', (state) => {
        device_id = state.device_id;
        console.log('Ready with Device ID', device_id);
        spotifyPlayerStatus.set('ready');
        createShortcuts();
    });

    SpotifyPlayer.addListener('player_state_changed', (state) => {
        console.log(state);
        spotifyPlayerState.set(state ? {...state} : null);
    });
}

