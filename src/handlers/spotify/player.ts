import { SpotifyAuthClient } from '../../lib/spotify/SpotifyAuthClient';
import { spotifyAccessToken, spotifyPlayerStatus } from '../../stores/spotify';
import { logout } from './login';

export let player: Spotify.Player;
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
                localStorage.setItem('refreshToken', response.refresh_token);
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

    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        spotifyPlayerStatus.set('ready');
    });
}