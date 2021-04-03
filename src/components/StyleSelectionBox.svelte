<script lang="ts">
    import styles from "../clockStyles/styles";

    const windowClass: string = 'w-36';
    let activeStyle: number = 6;

    function changeStyle(toStyle: number) {
        if (toStyle >= 0 && toStyle <= (styles.length -1)) {
            activeStyle = toStyle;
        }
    }

    function moveLeft() {
        changeStyle(activeStyle - 1)
    }

    
    function moveRight() {
        changeStyle(activeStyle + 1)
    }
</script>

<div class="flex flex-col items-center">
    <div class="font-primary text-base text-primary">Select your clock style</div>
    <div class="relative flex">
        <div class="flex flex-row z-10 absolute top-0 left-0 h-full w-full">
            <div class="h-full flex flex-row -trans-x-2/4 relative top-0 left-2/4">
                <button aria-label="move left" class="cursor-pointer outline-none border-none focus:outline-none" data-direction="backward" on:click|stopPropagation={moveLeft}>
                    <i class="fas fa-caret-left text-primary text-md"></i>
                </button>
                <span class="inline-block {windowClass} opacity-0"></span>
                <button aria-label="move right" class="cursor-pointer outline-none border-none focus:outline-none" data-direction="forward" on:click|stopPropagation={moveRight}>
                    <i class="fas fa-caret-right text-primary text-md"></i>
                </button>
            </div>
        </div>
        <div class="relative">
            {#each styles as style, i }
            <span 
                class="{windowClass} text-center inline-block text-primary font-primary text-xl {i === activeStyle ? 'opacity-1' : 'opacity-0'}" 
                data-selection={i}
            >
                {style.label}
            </span>
            {/each}
        </div>
    </div>
    <div class="flex flex-row">
        <button aria-label="format 12 hours" class="soft-show text-primary">12H</button>
        <div class="w-6"></div>
        <button aria-label="format 24 hours" class="soft-show text-primary">24H</button>
    </div>
</div>