import { urlParams } from '../../utils/utils';
import { generateSpotifyUrl } from '../../lib/spotify/generateSpotifyUrl';
import { spotifyAccessToken, spotifyPlayerState, spotifyPlayerStatus, spotifyUrl } from '../../stores/spotify';
import { SpotifyClient } from '../../lib/spotify/SpotifyClient';
import { createShortcuts } from './shortcuts';
import { SpotifyAuthClient } from '../../lib/spotify/SpotifyAuthClient';

export let SpotifyPlayer: Spotify.Player;
export let device_id: string;
export const refreshingToken = {
    running: false,
    set(state: boolean) {
        this.running = state;
    }
}

const authClient = new SpotifyAuthClient(process.env.SPOTIFY_CLIENT_ID);

let loginTimeout: NodeJS.Timeout;
export async function attemptSpotifyLogin() {
    loginTimeout = setTimeout(() => {
        spotifyPlayerStatus.set('error');
        throw 'Login request timed out'
    }, 60 * 1000);

    if (!localStorage.getItem('userHasLogged')) {
        if (!urlParams.get('state')) {
            //The user has never logged before to the app
            let url;
            try {
                url = await generateSpotifyUrl();
            } catch (e) {
                throwAuthError('Cannot generate Spotify\'s login URL. Your browser might be unsupported');
            }
            
            if (!url) return;
            spotifyUrl.set(url);
            clearTimeout(loginTimeout);
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
    } else if (localStorage.getItem('userHasLogged') == 'true') {
        window.onSpotifyWebPlaybackSDKReady = () => {
            spotifyPlayerStatus.set('connecting');
            createNewSpotifyPlayer()
                .catch(err => {
                    spotifyPlayerStatus.set('error');
                    console.log(err);
                }) 
                .finally(() => {
                    console.info('onSpotifyWebPlaybackSDKReady event fired!')
                    clearTimeout(loginTimeout);
                })
        };
    }
}

export function logout() {
    ['userHasLogged', 'refreshToken', 'verifier', 'state'].forEach(el => localStorage.removeItem(el));
    ['accessToken', 'expires_at', 'spotify_token_expires'].forEach(el => sessionStorage.removeItem(el));
}

export async function refershOrGetOAuthToken() {
    let response;
    refreshingToken.set(true);
    console.info('Spotify: refreshing access token');

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
            refreshingToken.set(false);
            if (err.status === 400 && err.data.error === 'invalid_grant') spotifyPlayerStatus.set('expired');
            throw err;
        }
    }
    
    refreshingToken.set(false);
    
    localStorage.removeItem('code');
    localStorage.setItem('refreshToken', response.refresh_token);
    if (response.expires_in) autoRefeshToken(response.expires_in);
    SpotifyClient.setAccessToken(response.access_token);
    spotifyAccessToken.set(response.access_token);
    return response.access_token;
}


let refreshTimeout: NodeJS.Timeout;
function autoRefeshToken(seconds: number, enable = true) {
    clearTimeout(refreshTimeout);
    seconds = seconds + 15;
    if (enable) {
        console.log('Refreshing token in ' + seconds + ' seconds');
        refreshTimeout = setTimeout(() => {
            if (!refreshingToken.running) refershOrGetOAuthToken();
        }, seconds * 1000);
    }
}

async function createNewSpotifyPlayer() {
    console.info('creating spotify player');

    SpotifyPlayer = new Spotify.Player({
        name: 'Relaxing Clock',
        getOAuthToken: async (callback) => {
            const access_token = await refershOrGetOAuthToken().catch((e) => console.error(e));
            callback(access_token);
        }
    });

    
    window.addEventListener('beforeunload', (e) => {
        SpotifyPlayer.disconnect();
    });
    // window.addEventListener('unload', () => SpotifyPlayer.disconnect());

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
        console.log('Spotify player_state_changed', state);
        spotifyPlayerState.set(state ? {...state} : null);
    });
}

function throwAuthError(reason = '') {
    spotifyUrl.set(undefined);
    spotifyPlayerStatus.set(reason === 'access_denied' ? 'access_denied' : 'error');
    console.error('Authentication Error!: ' + reason);
    
    if (reason === 'access_denied') {
        window.location.replace('/');
    }
}