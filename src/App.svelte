<script lang="ts">
	import Rooster from './components/roaster/Rooster.svelte';
	import Home from './components/sections/Home.svelte';
	import Settings from './components/sections/Settings.svelte';
	import { summoned } from './stores/rooster';

	function handleKeydown(event: KeyboardEvent) {
		if (event.code === 'Space' && event.ctrlKey) {
			console.log('Rooster summoned');
			summoned.set(!$summoned);
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $summoned}
	<Rooster />
{/if}

<main class="w-screen h-screen">
	<Home />
	<Settings />

	<div id="main-bg" class="absolute top-0 left-0 h-full w-full -z-10"></div>
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
