<script lang="ts">
    import init from './handlers/init';
	import { onMount } from 'svelte';

	import MainBg from './components/elements/MainBg.svelte';
	import Rooster from './components/rooster/Rooster.svelte';
	import Home from './components/sections/Home.svelte';
	import Settings from './components/sections/Settings.svelte';
	import { summoned } from './stores/rooster';
    import { loggedWithSpotify } from './stores/storedSettings';
    import NotificationsPanel from './components/sections/notifications/NotificationsPanel.svelte';

	// onMount(() => init());
</script>

<svelte:head>
    {#if $loggedWithSpotify}<script src="https://sdk.scdn.co/spotify-player.js" defer></script>{/if}
</svelte:head>

<Rooster />

<main class="w-screen h-screen">
	<Home />
	<Settings />
    <NotificationsPanel />
    
	<MainBg />
</main>

<style global>
    @import '@csstools/normalize.css';

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
