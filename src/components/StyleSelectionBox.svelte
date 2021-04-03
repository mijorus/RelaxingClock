<script lang="ts">
    import { spring } from 'svelte/motion';

    import styles from "../clockStyles/styles";

    const windowClass: string = 'w-44';
    const buttonClass: string = 'text-primary outline-none border-none focus:outline-none';
    let activeStyle: number = 0;

    let selectionPosition = spring(0, {
        stiffness: 0.07,
        damping: 0.3,
    });

    function changeStyle(toStyle: number) {
        const l: number = styles.length;
        
        if (toStyle >= 0 && toStyle <= (l - 1)) {
            activeStyle = toStyle;
            selectionPosition.set( - (100 / l) * activeStyle);
        } else {
            selectionPosition.set(toStyle > 0 ? ( - ((100 / l) * (l - 1)) - 3) : 3);
            setTimeout(() => selectionPosition.set(toStyle > 0 ? ( - (100 / l) * (l - 1)) : 0), 100);
        }
    }

    function moveLeft() {
        changeStyle(activeStyle - 1);
    }

    
    function moveRight() {
        changeStyle(activeStyle + 1);
    }
</script>

<div class="flex flex-col items-center">
    <div class="font-primary text-base text-primary">Select your clock style</div>
    <div class="relative flex">
        <div class="flex flex-row z-10 absolute top-0 left-0 h-full w-full">
            <div class="h-full flex flex-row -trans-x-2/4 relative top-0 left-2/4">
                <button aria-label="move left" class="cursor-pointer outline-none border-none focus:outline-none w-4" data-direction="backward" 
                    on:click={moveLeft}
                >
                    <i class="fas fa-caret-left text-primary text-md opacity-{activeStyle === 0 ? '20' : 1} fade"></i>
                </button>
                <span class="inline-block {windowClass} opacity-0"></span>
                <button aria-label="move right" class="cursor-pointer outline-none border-none focus:outline-none w-4" data-direction="forward" 
                    on:click={moveRight}
                >
                    <i class="fas fa-caret-right text-primary text-md opacity-{activeStyle === styles.length - 1 ? '20' : '1'} fade"></i>
                </button>
            </div>
        </div>
        <div class="relative left-2/4" style="transform: translateX({$selectionPosition}%);">
            {#each styles as style, i }
            <span 
                class="{windowClass} text-center fade inline-block text-primary font-primary text-xl -trans-x-2/4 {i === activeStyle ? 'opacity-1' : 'opacity-0'}" 
                data-selection={i}
            >
                {style.label}
            </span>
            {/each}
        </div>
    </div>
    <div class="flex flex-row">
        <button aria-label="format 12 hours" class="{buttonClass}">12H</button>
        <div class="w-6"></div>
        <button aria-label="format 24 hours" class="{buttonClass}">24H</button>
    </div>
</div>

<style>
    .fade {
        transition: opacity .15s linear;
    }
</style>