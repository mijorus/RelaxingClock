import { get } from 'svelte/store';

import { attemptSpotifyLogin } from './spotify/login';
import { onlineStatus } from '../stores/globalState';

export default function init() {
    if (get(onlineStatus)) {
        attemptSpotifyLogin();
    }
}
