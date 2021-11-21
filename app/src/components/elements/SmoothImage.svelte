<script lang="ts">
import { onMount } from "svelte";

    export let src: string;
    export let classes = '';
    let id: string;
    onMount(() => id = Math.random().toString(36).slice(2).replace(/\d/g, ''));
</script>
<img {id} {src} alt="" class="{classes} opacity-0 transition-opacity" on:load="{() => document.querySelector(`#${id}`).classList.remove('opacity-0')}">