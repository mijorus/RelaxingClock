import axios from 'axios';
import qs from 'qs';

declare let process: any;

export class spotifyAuthClient {
    clientId: string;
    baseURL: string;

    constructor(clientId: string) {
        this.clientId = clientId;
        this.baseURL = 'https://accounts.spotify.com/api';
    }

    postRequest(url: string, data: any) {
        return axios({
            url: this.baseURL + url,
            method: 'POST',
            headers: { 
                'content-type': 'application/x-www-form-urlencoded' 
            },
            data: qs.stringify(data)
        })
            .then(res => res.data);
    }

    requestToken(code: string, redirect_uri: string, code_verifier: string) {
        return this.postRequest('/token', {
            code,
            code_verifier,
            redirect_uri,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            grant_type: 'authorization_code',
        });
    }

    refreshToken(refresh_token: string) {
        return this.postRequest('/token', {
            refresh_token,
            client_id: this.clientId,
            grant_type: 'refresh_token',
        });
    }
}

// export function requestToken(code: string, redirect_uri: string, code_verifier: string) {
//     spotifyClient({
//         method: 'POST',
//         url: '/token',
//         data: {
//             code,
//             client_id: process.env.SPOTIFY_CLIENT_ID,
//             grant_type: 'authorization_code',
//             redirect_uri: redirectURI,
//             code_verifier: localStorage.verifier
//         }
//     })
//         .done(function (response) {
//             localStorage.removeItem('code');
//             localStorage.removeItem('verifier');
//             saveLoginResponse(response);
//         })
//         .fail(function (error) {
//             spotifyError.logError('Cannot get token from Spotify', error);
//         });
// }

// export function refreshToken() {
//     return request({
//         method: 'POST',
//         url: 'https://accounts.spotify.com/api/token',
//         data: {
//             refresh_token,
//             client_id: this.clientId,
//             grant_type: 'refresh_token',
//         },
//     });
// }