<script lang="ts">
    import init from './handlers/init';
	import { onMount } from 'svelte';

	import MainBg from './components/elements/MainBg.svelte';
	import Rooster from './components/rooster/Rooster.svelte';
	import Home from './components/sections/Home.svelte';
	import Settings from './components/sections/Settings.svelte';
	import { summoned } from './stores/rooster';
    import { loggedWithSpotify } from './stores/storedSettings';

	onMount(() => init());

	function handleKeydown(event: KeyboardEvent) {
		if (event.code === 'Space' && event.ctrlKey) {
			console.log('Rooster summoned');
			summoned.set(!$summoned);
		}
	}
</script>

<svelte:head>
    {#if $loggedWithSpotify}<script src="https://sdk.scdn.co/spotify-player.js" defer></script>{/if}
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

{#if $summoned}
	<Rooster />
{/if}

<main class="w-screen h-screen">
	<Home />
	<Settings />
	
	<MainBg />
</main>

<style global lang="postcss">
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
    }
</style>
