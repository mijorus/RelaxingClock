<script lang="ts">
    import { windowReady } from "html-ready";

    import styles from "./clockStyles/styles";
    import { activeStyle, presentation } from "../../stores/storedSettings";
    import { activeStyleId, nextStyleId } from "../../stores/clockStyle";
    import anime from "animejs";
    import { eaElasticDefault } from "../../utils/animations";
    import { onMount, tick } from "svelte";
    import { clockIsVisible, styleChangeLock } from "../../stores/globalState";
    import { screenSaver } from "../../stores/globalState";
    import { clockStyleClass } from "../../stores/storedSettings";

    let bigClock: HTMLElement;
    $: setCurrentPosition($activeStyle);

    async function setCurrentPosition(activeStyle: number) {
        await windowReady;
        if (activeStyle !== undefined) {
            const toStyleId: number = styles[activeStyle].id;

            if (bigClock) {
                anime({
                    begin() {
                        nextStyleId.set(toStyleId);
                    },
                    targets: bigClock,
                    duration: 750,
                    easing: eaElasticDefault,
                    translateX: `${activeStyle * (-100 / styles.length)}%`,
                    complete() {
                        activeStyleId.set(toStyleId);
                    },
                });
            }
        }
    }

    onMount(() => {
        if (!$activeStyle) activeStyle.set(0);
    });
</script>

<div
    bind:this={bigClock}
    id="big-clock"
    class="flex flex-row items-center flex-nowrap {$clockStyleClass} font-semibold text-primary text-giant-0.5 lg:text-giant-1 transition-opacity
        whitespace-nowrap w-auto h-full z-10 absolute top-0 left-0 select-none {$screenSaver && !$presentation ? 'opacity-75' : ''}"
>
    {#each styles as style}
        <svelte:component this={style.component} />
    {/each}
</div>

<style global>
    .common-clock-background-image {
        opacity: 0.9;
        text-shadow: 0 0 20px var(--secondary);
    }
</style>
