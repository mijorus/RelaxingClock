import { spotifyAuthClient } from '../../lib/spotify/requests';
import { spotifyPlayerStatus } from '../../stores/spotify';

export let player: Spotify.Player;

const client = new spotifyAuthClient(process.env.SPOTIFY_CLIENT_ID);

export async function createNewSpotifyPlayer() {
    console.log('creating spotify player');
    spotifyPlayerStatus.set('connecting');
    
    let response;
    
    try {
        //We request a token for the first time
        if (localStorage.getItem('code') && localStorage.getItem('verifier')) {
            response = await client.requestToken(localStorage.getItem('code'), process.env.SPOTIFY_REDIRECT_URL, localStorage.getItem('verifier'));
            localStorage.removeItem('verifier');
        }
        
        else if (localStorage.getItem('refreshToken')) {
            //We need to request a new token using refreshToken
            response = await client.refreshToken(localStorage.getItem('refreshToken'));
        }
    } catch (err) {
        console.error(err);
        spotifyPlayerStatus.set('error');
        return;
    }
    
    localStorage.removeItem('code');

    if (response.refresh_token && response.access_token) {
        localStorage.setItem('refreshToken', response.refresh_token);

        player = new Spotify.Player({
            name: 'Relaxing Clock',
            getOAuthToken: async (callback) => {
                callback(response.access_token);
            }
        });

        // Error handling
        player.addListener('initialization_error', ({ message }) => { console.error(message); });
        player.addListener('authentication_error', ({ message }) => { console.error(message); });
        player.addListener('account_error', ({ message }) => { console.error(message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); });


        const success = await player.connect();
        if (!success) {
            console.log('Failed to connect to the Spotify Player');
            return;
        } 

        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            spotifyPlayerStatus.set('ready');
        });
    }
}