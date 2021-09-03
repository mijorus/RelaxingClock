<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let state: boolean;
    export let label: string;
    export let states = ['ON', 'OFF'];
    export let dimentions = [10, 12];
    const dispatch = createEventDispatcher();


    const btnsClass: string = 'text-md text-center settings-btn px-2 py-1 rounded-xl font-primary font-bold relative z-10';

    function handleBtnClick({target}) {
        state = target.dataset.option === 'on' ? true : false;
        dispatch('change', state);
    }
</script>

<div class="relative">
    <button class="{btnsClass} {state ? 'text-secondary':'text-primary'} w-{dimentions[0]}"
        data-option="on" 
        alt="{label} on"
        on:click|stopPropagation={handleBtnClick}
    >
        {states[0]}
    </button>
    <button class="{btnsClass} {!state ? 'text-secondary':'text-primary'} w-{dimentions[1]}" 
        data-option="off" 
        alt="{label} off"
        on:click|stopPropagation={handleBtnClick}
    >
        {states[1]}
    </button>
    <div class="absolute h-full bg-highlighted top-0 rounded-xl settings-btr-pill {state ? `push-left w-${dimentions[0]}` : `push-right w-${dimentions[1]}`}"></div>
</div>

<style>
    .settings-btr-pill {
        transition: right .2s ease-out, transform .2s ease-out;
    }

    .push-left {
        right: 100%;
        transform: translateX(100%);
    }

    .push-right {
        right: 0%;
        transform: translateX(0%);
    }
</style>