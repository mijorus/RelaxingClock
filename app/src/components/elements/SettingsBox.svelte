<script lang="ts">
import { afterUpdate, onMount, tick } from "svelte";

    export let unsupported = false;
    export let id: string = null;
    export let collapsable = true;
    export let bordered = true;

    let isCollapsed = false;
    let slotContainer: HTMLElement;
    
    function collapse() {
        isCollapsed = !isCollapsed;
        
        if (id) {
            let config = JSON.parse(localStorage.getItem('settingBoxCollapedStatus'));
            config[id] = isCollapsed,
            localStorage.setItem('settingBoxStatus', JSON.stringify(config));
        }

        if (isCollapsed) {
            slotContainer.querySelectorAll('.settings-box-element').forEach((el: HTMLElement) => {
                el.style.maxHeight = '0'
                el.style.padding = '0'
                el.style.margin = '0'
                el.style.overflow = 'hidden';
                el.style.opacity = '0';
            });
        } else {
            slotContainer.querySelectorAll('.settings-box-element').forEach((el: HTMLElement) => {
                el.style.maxHeight = null;
                el.style.padding = null;
                el.style.margin = null;
                el.style.overflow = null;
                el.style.opacity = null;
            });
        }
    }
    // afterUpdate(() => {
    //     slotContainer.querySelectorAll('.settings-box-element').forEach((el: HTMLElement) => {
    //         el.style.height = '0'
    //         el.style.padding = '0'
    //         el.style.margin = '0'
    //         el.style.overflow = 'hidden';
    //     });
    // })

    onMount(async () => {
        await tick();
        const title: HTMLElement = slotContainer.querySelector('.settings-box-element-title');
        if (collapsable && title) {
            title.addEventListener('click', collapse)
        } else if (title && !collapsable) {
            title.querySelector('.settings-box-element-title-arrow').classList.add('hidden');
        }
    })
</script>

<div {id} class="flex py-3 rounded-xl border-2 {bordered ? 'border-secondary' : 'border-transparent'} flex-row justify-end mb-6 md:mb-10 {unsupported ? 'pointer-events-none opacity-40': ''}">
    <div bind:this={slotContainer} class="w-full flex flex-col relative md:w-11/12">
        <slot></slot>
    </div>
</div>

<style>
    :global(.settings-box-element) {
        transition: max-height .35s ease-out, opacity .35s ease-out;
    }
</style>