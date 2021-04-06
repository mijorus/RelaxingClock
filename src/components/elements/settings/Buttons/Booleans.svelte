<script lang="ts">
    export let state: boolean;
    export let label: string;

    const btnsClass: string = 'text-md text-center settings-btn px-2 py-1 border-primary border-2 rounded-xl font-primary font-bold relative z-10';

    function handleBtnClick({target}) {
        state = target.dataset.option === 'on' ? true : false;
    }
</script>

<div class="relative">
    <button class="{btnsClass} {state ? 'text-secondary':'text-primary'} w-10"
        data-option="on" 
        alt="{label} on"
        on:click|stopPropagation={handleBtnClick}
    >
        ON
    </button>
    <button class="{btnsClass} {!state ? 'text-secondary':'text-primary'} w-12" 
        data-option="off" 
        alt="{label} off"
        on:click|stopPropagation={handleBtnClick}
    >
        OFF
    </button>
    <div class="absolute h-full bg-highlighted top-0 rounded-xl settings-btr-pill {state ? 'push-left w-10' : 'push-right w-12'}"></div>
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