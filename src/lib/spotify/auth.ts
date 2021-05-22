import { urlParams } from '../../utils/utils';
import { generateSpotifyUrl } from './generateSpotifyUrl';

export function login() {
    if (compatibility.login && compatibility.onlineStatus) {
        if (localStorage.userHasLogged === 'false') {
            if (urlParams.get('state') === undefined) {
                //The user has never logged before to the app
                generateSpotifyUrl();
            } else if (urlParams.get('state') && urlParams.get('error') === undefined) {
                //The user comes from the Spotify's authentication page
                //without errors
                if (urlParams.get('state') === localStorage.state) {
                    //The state variables match, the authentication is completed,
                    //the app will reload the page to clean the address bar
                    localStorage.userHasLogged = 'true';
                    localStorage.removeItem('state');
                    localStorage.setItem('code', urlParams.get('code'));
                    window.location.replace(process.env.SPOTIFY_BASE_URL);
                } else {
                    //The states don't match, the authentication failed
                    throwAuthError('States do not match');
                }
            } else if (urlParams.get('error')) {
                //Spotify responded with an error during the authentication process
                throwAuthError(urlParams.get('error'));
            }
        } else if (localStorage.userHasLogged === 'true' && compatibility.login) {
            window.onSpotifyWebPlaybackSDKReady = () => {
                $(musicBox).removeClass('unlogged').addClass('logged');
                createNewSpotifyPlayer();
            };
        }
    } else {
        throwUncompatibilityErr();
    } 
}