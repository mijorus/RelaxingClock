<script lang="ts">
    import { windowReady } from 'html-ready';

    import styles from "./clockStyles/styles";
    import { activeStyle } from "../../stores/storedSettings";
    import { activeStyleId, nextStyleId } from "../../stores/clockStyle";

    // import Classic from './clockStyles/Classic.svelte';
    // import Focused from './clockStyles/Focused.svelte';
    // import Metro from './clockStyles/Metro.svelte';
    // import Analog from "./clockStyles/Analog.svelte";
    import anime from "animejs";
    import { eaElasticDefault } from "../../utils/animations";

    let bigClock: HTMLElement;
    $: setCurrentPosition($activeStyle)

    async function setCurrentPosition(activeStyle: number) {
        await windowReady;
        const toStyleId: number =  styles[activeStyle].id;

        anime({
            begin() { nextStyleId.set(toStyleId) },
            targets: bigClock,
            duration: 750,
            easing: eaElasticDefault,
            translateX: `${activeStyle * (-100 / styles.length)}%`,
            complete() { activeStyleId.set(toStyleId) }
        })
    }
</script>

<div 
    bind:this={bigClock}
    id="big-clock" 
    class="flex flex-row items-center flex-nowrap font-clock text-primary text-giant-1 whitespace-nowrap w-auto h-full z-10 absolute top-0 left-0" 
    
>
    {#each styles as style}
        <svelte:component this={style.component} />
    {/each}
</div>