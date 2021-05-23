import { urlParams } from '../../utils/utils';
import { generateSpotifyUrl } from '../../lib/spotify/generateSpotifyUrl';
import { spotifyUrl } from '../../stores/spotify';
import { createNewSpotifyPlayer } from './player';

declare let process: any;

export async function attemptSpotifyLogin() {
    if (localStorage.getItem('userHasLogged') === 'false') {
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
                window.location.replace(process.env.SPOTIFY_BASE_URL);
            } else {
                //The states don't match, the authentication failed
                throwAuthError('States do not match');
            }
        } else if (urlParams.get('error')) {
            //Spotify responded with an error during the authentication process
            throwAuthError(urlParams.get('error'));
        }
    } else if (localStorage.getItem('userHasLogged') === 'true' && localStorage.getItem('code')) {
        window.onSpotifyWebPlaybackSDKReady = () => {
            createNewSpotifyPlayer();
        };
    }
}

function throwAuthError(reason = '') {
    console.error('Authentication Error!: ' + reason);
}