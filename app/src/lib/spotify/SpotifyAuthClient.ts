import axios from 'axios';
import qs from 'qs';

export class SpotifyAuthClient {
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
            .then(res => res.data)
            .catch(err => { throw err.response })
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