<script lang="ts">
import { onMount, tick } from 'svelte';

import MainBg from './components/elements/MainBg.svelte';
import Rooster from './components/rooster/Rooster.svelte';
import Home from './components/sections/Home.svelte';
import Settings from './components/sections/Settings.svelte';
import { loggedWithSpotify } from './stores/storedSettings';
import NotificationsPanel from './components/sections/notifications/NotificationsPanel.svelte';
import { modalContent, onlineStatus } from './stores/globalState';
import { spotifyAccessToken, spotifyPlayerStatus, spotifyUserData } from './stores/spotify';
import { attemptSpotifyLogin } from './handlers/spotify/login';
import { SpotifyClient } from "./lib/spotify/SpotifyClient";
import AlarmRing from './components/elements/AlarmRing.svelte';
import screenSaverHandler from "./handlers/screenSaver";
import LoadingScreen from './components/sections/LoadingScreen.svelte';
import animatedBg from "./handlers/animatedBg";
import ColorSelector from './components/elements/ColorSelector.svelte';
import Modal from './components/elements/Modal.svelte';
import { notifications } from './stores/notifications';
import { windowReady } from 'html-ready';
import IntroTutorialModal from './components/Modals/IntroTutorialModal.svelte';

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

	onMount(async () => {
        if (process.env.production) console.log = function() {};

        // Var init
        localStorage.setItem('settingBoxCollapedStatus', JSON.stringify({}));
        
        // Spotify Login
        if ($onlineStatus) {
            attemptSpotifyLogin()
                .catch((e) => console.error(e))
        }

        if (!localStorage.getItem('hasSeenTutorial')) {
            await tick();
            modalContent.set(IntroTutorialModal);
            localStorage.setItem('hasSeenTutorial', 'true');
        }
    });
</script>

<svelte:head>
    {#if $loggedWithSpotify}<script src="https://sdk.scdn.co/spotify-player.js" defer></script>{/if}
</svelte:head>

<LoadingScreen />
<Rooster />

{#await windowReady then _}
    <main class="w-screen h-screen overflow-x-hidden relative">
        <Home />
        <Settings />
        <NotificationsPanel />
        <MainBg />
    </main>
{/await}

<AlarmRing />
<ColorSelector />
<Modal />

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