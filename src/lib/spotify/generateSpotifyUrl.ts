import buildUrl from 'build-url';

const scopes = 'user-read-email,user-read-private,user-read-playback-state,user-modify-playback-state,user-read-currently-playing,user-library-modify,user-library-read,streaming,playlist-read-collaborative';

export async function generateSpotifyUrl() {
    const state: string = generateRandomString();
    localStorage.setItem('state', state);

    const verifier: string = generateRandomString();
    localStorage.setItem('verifier', verifier);

    const challenge: string = await generateChallenge(verifier);

    return buildUrl('https://accounts.spotify.com/', {
        path: 'authorize',
        queryParams: {
            client_id: process.env.SPOTIFY_CLIENT_ID,
            response_type: 'code',
            redirect_uri: process.env.SPOTIFY_REDIRECT_URL,
            code_challenge_method: 'S256',
            code_challenge: challenge,
            scope: scopes,
            state,
        }
    });
}

function generateRandomString(): string {
    const array = new Uint32Array(30);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

function base64urlencode(str: any): string {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function sha256(plain: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

async function generateChallenge(verifier: string): Promise<string> {
    const hashedVerifier = await sha256(verifier);
    return base64urlencode(hashedVerifier);
}