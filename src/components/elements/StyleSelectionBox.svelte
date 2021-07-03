<script lang="ts">
    import { spring } from 'svelte/motion';
    import { activeStyle, clockFormat } from "../../stores/storedSettings";
    import { screenSaver, styleChangeLock } from '../../stores/globalState';
    import styles from "../clock/clockStyles/styles";

    const viewFinderClass: string = 'w-44';
    const buttonClass: string = 'text-primary outline-none c-format focus:outline-none cursor-pointer';
    const l: number = styles.length; //the number of available styles

    let selectionPosition = spring(0, {
        stiffness: 0.07,
        damping: 0.3,
    });

    changeStyle($activeStyle);

    function changeStyle(toStyle: number) {
        if (toStyle >= 0 && toStyle <= (l - 1)) {
            activeStyle.set(toStyle);
            selectionPosition.set( - (100 / l) * $activeStyle);
        } else {
            const overScroll: number = 3; //the amount pixels of the overscroll effect
            selectionPosition.set((toStyle > 0) ? ( - ((100 / l) * (l - 1)) - overScroll) : overScroll);
            
            setTimeout(() => {
                selectionPosition.set((toStyle > 0) ? ( - (100 / l) * (l - 1)) : 0)
            }, 100);
        }
    }

    function moveLeft() {
        if (!$styleChangeLock) changeStyle($activeStyle - 1);
    }

    function moveRight() {
        if (!$styleChangeLock) changeStyle($activeStyle + 1);
    }
</script>

<div class="z-20 absolute flex flex-col items-center overflow-visible top-2/4 mt-36 fade select-none {$screenSaver ? 'opacity-0' : 'opacity-1'}">
    <div class="font-primary text-xl text-primary">Select your clock style</div>
    <div class="relative flex overflow-hidden">
        <div class="flex flex-row z-10 absolute top-0 left-0 h-full w-full">
            <div class="h-full flex flex-row transform -translate-x-2/4 relative top-0 left-2/4">
                <button aria-label="move left" class="cursor-pointer outline-none border-none focus:outline-none w-4" data-direction="backward" 
                    on:click={moveLeft}
                >
                    <i class="fas fa-caret-left text-primary text-md opacity-{$activeStyle === 0 ? '20' : 1} fade"></i>
                </button>
                <span class="inline-block {viewFinderClass} opacity-0"></span>
                <button aria-label="move right" class="cursor-pointer outline-none border-none focus:outline-none w-4" data-direction="forward" 
                    on:click={moveRight}
                >
                    <i class="fas fa-caret-right text-primary text-md opacity-{$activeStyle === styles.length - 1 ? '20' : '1'} fade"></i>
                </button>
            </div>
        </div>
        <div class="relative left-2/4 whitespace-nowrap my-1" style="transform: translateX({$selectionPosition}%);">
            {#each styles as style, i }
            <span 
                class="{viewFinderClass} text-center fade inline-block transform -translate-x-2/4 {i === $activeStyle ? 'opacity-1' : 'opacity-0'}" 
                data-selection={i}
            >
                <span class="inline-block text-bg bg-highlighted rounded-2xl font-primary text-xl px-2 py-0">{style.label}</span>
            </span>
            {/each}
        </div>
    </div>
    <div class="flex flex-row font-primary text-primary">
        <button aria-label="format 12 hours" class="{buttonClass} {$clockFormat === '12h' ? 'active-format' : ''} c-format" on:click={() => clockFormat.set('12h')}>12H</button>
        <div class="w-6"></div>
        <button aria-label="format 24 hours" class="{buttonClass} {$clockFormat === '24h' ? 'active-format' : ''} c-format" on:click={() => clockFormat.set('24h')}>24H</button>
    </div>
</div>

<style>
    .fade {
        transition: opacity .3s linear;
    }

    .c-format {
        border: 2px solid transparent;
        transition: all .2s linear;
        opacity: 0.5;
    }

    .active-format {
        opacity: 1;
        transform: scale(1.1);
        border-bottom: 2px solid white !important;
    }
</style>