import type { Player } from 'spotify-web-playback-sdk';
import { spotifyAuthClient } from '../../lib/spotify/requests';

declare let process: any;

export let player: Player = undefined;

const client = new spotifyAuthClient(process.env.SPOTIFY_CLIENT_ID);

export async function createNewSpotifyPlayer() {
    player = new Spotify.Player({
        name: 'Relaxing Clocks',
        getOAuthToken: async (callback) => {
            let response;
            //We request a token for the first time
            if (localStorage.getItem('code')) {
                response = await client.requestToken(localStorage.getItem('code'), process.env.SPOTIFY_REDIRECT_URL, localStorage.getItem('verifier'));
                localStorage.removeItem('verifier');
            }
            
            else if (localStorage.getItem('refreshToken')) {
                //We need to request a new token using refreshToken
                response = await client.refreshToken(localStorage.getItem('refreshToken'));
            }
            
            console.log(response);
            
            localStorage.removeItem('code');
            saveLoginResponse(response);

            callback(sessionStorage.accessToken);
        }
    });

    if (await player.connect()) {
        console.log('logged in!');
        window.dispatchEvent(new Event('SpotifyPlayerConnected'));
    }

}

function saveLoginResponse(response) {
    console.log('Saving data...');
    sessionStorage.setItem('accessToken', response.access_token);
    localStorage.setItem('refreshToken', response.refresh_token);
}