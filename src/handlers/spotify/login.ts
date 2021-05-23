import { urlParams } from '../../utils/utils';
import { generateSpotifyUrl } from '../../lib/spotify/generateSpotifyUrl';
import { spotifyUrl } from '../../stores/spotify';
import { createNewSpotifyPlayer } from './player';

declare let process: any;

export async function attemptSpotifyLogin() {
    console.log(localStorage.getItem('userHasLogged') === 'true' );
    
    if (!localStorage.getItem('userHasLogged')) {
        if (!urlParams.get('state')) {
            //The user has never logged before to the app
            const url = await generateSpotifyUrl();
            spotifyUrl.set(url);
        } else if (urlParams.get('state') && !urlParams.get('error')) {
            //The user comes from the Spotify's authentication page
            //without errors
            if (urlParams.get('state') === localStorage.state) {
                //The state variables match, the authentication is completed,
                //the app will reload the page to clean the address bar
                localStorage.removeItem('state');
                localStorage.setItem('code', urlParams.get('code'));
                localStorage.setItem('userHasLogged', 'true');
                window.location.replace(process.env.SPOTIFY_REDIRECT_URL);
            } else {
                //The states don't match, the authentication failed
                throwAuthError('States do not match');
            }
        } else if (urlParams.get('error')) {
            //Spotify responded with an error during the authentication process
            throwAuthError(urlParams.get('error'));
        }
    } else if (localStorage.getItem('userHasLogged') === 'true' && localStorage.getItem('code')) {
        console.log('sonoqui');
        
        window.onSpotifyWebPlaybackSDKReady = () => {
            createNewSpotifyPlayer();
        };
    }
}

export function logout() {
    if (localStorage.getItem('userHasLogged')) localStorage.removeItem('userHasLogged');
    if (sessionStorage.accessToken) sessionStorage.removeItem('accessToken');
    if (sessionStorage.expires_at) sessionStorage.removeItem('expires_at');
    if (localStorage.refreshToken) localStorage.removeItem('refreshToken');
    localStorage.removeItem('verifier');
    localStorage.removeItem('state');
    window.location.reload();
}

function throwAuthError(reason = '') {
    console.error('Authentication Error!: ' + reason);
}

