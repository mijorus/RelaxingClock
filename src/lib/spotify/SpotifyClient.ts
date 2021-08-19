import SpotifyWebApi from 'spotify-web-api-js';
import Spotify from 'spotify-web-api-js'
import { attemptSpotifyLogin } from '../../handlers/spotify/login';


const sp = new Spotify();
class S {
    constructor() {
        const handler = {
            get: function (obj, prop) {
                if (typeof obj[prop] !== "function") {
                    return obj[prop];
                } else { 
                    return function (...args) {
                        return obj[prop].apply(obj, args)?.catch((err) => {
                            attemptSpotifyLogin()
                                .catch(err => { throw err });
                        });  
                    };
                }
            }
        }

        return new Proxy(sp, handler);
    }
}

export const SpotifyClient: SpotifyWebApi = new S();