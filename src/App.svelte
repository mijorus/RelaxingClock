<script lang="ts">
	import Home from './components/sections/Home.svelte';
	import Settings from './components/sections/Settings.svelte';
</script>

<main class="w-screen h-screen">
	<Home />
	<Settings />
</main>

<style global>
	@import '@csstools/normalize.css';

	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	@layer utilities {
		.transp-btn {
			cursor: pointer;
			border: none;
			background-color: transparent;
			outline: none;
		}
	}
</style>
