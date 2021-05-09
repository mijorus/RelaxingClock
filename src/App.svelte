<script lang="ts">
	import Home from './components/sections/Home.svelte';
	import Settings from './components/sections/Settings.svelte';
</script>

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
