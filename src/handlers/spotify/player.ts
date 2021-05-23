import { spotifyClient } from '../../lib/spotify/requests';

export let player = undefined;

const client = new spotifyClient(process.env.SPOTIFY_CLIENT_ID);

export function createNewSpotifyPlayer() {
    player = new Spotify.Player({
        name: 'Relaxing Clocks',
        getOAuthToken: async (callback) => {
            let response;
            //We request a token for the first time
            if (localStorage.getItem('code')) {
                response = await client.requestToken(localStorage.getItem('code'), process.env.SPOTIFY_BASE_URL, localStorage.getItem('verifier'));
            }

            else if (localStorage.getItem('refreshToken')) {
                //We need to request a new token using refreshToken
                response = await client.refreshToken(localStorage.getItem('refreshToken'));
            }

            saveLoginResponse(response);

            callback(sessionStorage.accessToken);
        }
    });
}

function saveLoginResponse(response) {
    console.log('Saving data...');
    sessionStorage.setItem('accessToken', response.access_token);
    localStorage.setItem('refreshToken', response.refresh_token);
}
