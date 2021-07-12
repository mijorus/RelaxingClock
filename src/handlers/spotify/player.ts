import { SpotifyAuthClient } from '../../lib/spotify/SpotifyAuthClient';
import { SpotifyClient } from '../../lib/spotify/SpotifyClient';
import { shortcuts } from '../../stores/rooster';
import { spotifyAccessToken, spotifyPlayerStatus, spotifyUserData } from '../../stores/spotify';
import type { RoosterExample, RoosterExamples } from '../../types';

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

    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        spotifyPlayerStatus.set('ready');
        createShortcuts();
    });
}

async function loadSearch(query: string, type: 'album'| 'playlist' | 'track' | 'search'): Promise<RoosterExamples> {
    if (!query || query.length < 2) return {};
    if (type === 'search') type = 'track';
    const res = await SpotifyClient.search(query, [type], { limit: 5 });
    console.log(res);
    
    let examples: RoosterExamples = {};
    for (const key of (Object.keys(res))) {
        let list: RoosterExample[] = [];
        res[key].items.forEach(item => {
            let artist = '';
            if (item.artists) item.artists.forEach(a => artist += ` ${a.name}`) 
            const image = key === 'tracks' ? item.album.images[item.album.images.length - 1].url : item.images[item.images.length - 1].url;
            list.push({'example': item.name, 'tip': artist, image, 'selectable': true})
        });

        examples[key] = {group: list};
    }
    
    return examples;
}

function createShortcuts() {
    shortcuts.set('spotify', {
        background: process.env.SPOTIFY_COLOR,
        color: process.env.BACKGROUND_DARK,
        arguments: {
            track: {
                async callback(p) {
                    
                    return true;
                }
            },
            search: {
                async callback(p) {
                    
                    return true;
                }
            },
            playlist: {
                async callback(p) {
                    
                    return true;
                }
            },
            album: {
                async callback(p) {
                    
                    return true;
                }
            }
        }, 
        async examples(arg, params) {
            if (['search','album','playlist', 'track'].find(a => a === arg)) {
                //@ts-ignore
                return loadSearch(params, arg);
            }

            return {}
        }
    })
}