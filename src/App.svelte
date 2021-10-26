<script lang="ts">
import { onMount } from 'svelte';

import MainBg from './components/elements/MainBg.svelte';
import Rooster from './components/rooster/Rooster.svelte';
import Home from './components/sections/Home.svelte';
import Settings from './components/sections/Settings.svelte';
import { loggedWithSpotify } from './stores/storedSettings';
import NotificationsPanel from './components/sections/notifications/NotificationsPanel.svelte';
import { onlineStatus } from './stores/globalState';
import { spotifyAccessToken, spotifyPlayerStatus, spotifyUserData } from './stores/spotify';
import { attemptSpotifyLogin } from './handlers/spotify/login';
import { SpotifyClient } from "./lib/spotify/SpotifyClient";
import AlarmRing from './components/elements/AlarmRing.svelte';
import screenSaverHandler from "./handlers/screenSaver";
import LoadingScreen from './components/sections/LoadingScreen.svelte';
import animatedBg from "./handlers/animatedBg";

    screenSaverHandler.set(20 * 1000);
    // screenSaverHandler.set(1 * 1000);

    $: getUserData($spotifyAccessToken);

    async function getUserData(accessToken: string) {
        if (accessToken) {
            const me = await SpotifyClient.getMe();
            spotifyUserData.set(me);
            if (me.product !== 'premium') { 
                spotifyPlayerStatus.set('non-premium');
            }
        }
    }   

	onMount(() => {
        // animatedBg()
        if ($onlineStatus) {
            attemptSpotifyLogin()
                .catch((e) => console.error(e))
        }
    });
</script>

<svelte:head>
    {#if $loggedWithSpotify}<script src="https://sdk.scdn.co/spotify-player.js" defer></script>{/if}
</svelte:head>

<LoadingScreen />

<Rooster />
<main class="w-screen h-screen">
	<Home />
	<Settings />
    <NotificationsPanel />
	<MainBg />
</main>
<AlarmRing />

<div class="w-12 hidden"></div>
<style global>
    @import '@csstools/normalize.css';
    @import 'loaders.css/loaders.min.css';

    /* purgecss start ignore */
    @tailwind base;
    @tailwind components;
    /* purgecss end ignore */
    @tailwind utilities;

    @layer utilities {
        .transp-btn {
            cursor: pointer;
            border: none;
            background-color: transparent;
            outline: none;
        }
        
        .transp-btn:focus {
            border: none;
            background-color: transparent;
            outline: none;
        }
        
        .transp-btn:active {
            border: none;
            background-color: transparent;
            outline: none;
        }

        .shadow-box {
            box-shadow: 0px -15px 50px 0px var(--primary);
        }
    }
</style>