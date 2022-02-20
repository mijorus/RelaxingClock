<script lang="ts">
import { createEventDispatcher } from "svelte";
import type { StoredPinned } from "../../../handlers/PinnedDB";
import { fade, scale } from "svelte/transition";
import colors  from "simple-color-functions";
import Pin from "../../icons/Pin.svelte";
import AnimatedText from "../../elements/AnimatedText.svelte";
import { tips } from "../../../stores/globalState";

    export let p: StoredPinned;
    export let scrollPaused;
    let dispatch = createEventDispatcher();

    function handleMouseEnter() {
        tips.set([{shortcut: 'Long press pin and move', name: 'Drag the bubble around'}])
    }

    function handleMouseLeave() {
        tips.set(null);
    }
</script>

<div id="pinned-{p.id}" data-id={p.id} class="hidden md:block absolute top-0 left-0 pinned" on:mousedown|stopPropagation={() => dispatch('focus')}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    style="transform: translateY({p.top > 0 ? p.top :  0}px) translateX({p.left > 0 ? `${p.left}px` : '0'});"
>
    <div class="pinned-inner bg-black relative m-2 xl:m-6 rounded-2xl p-0 text-primary w-80" transition:scale>
        <div class="pinned-bg p-3 rounded-2xl" style="background-color: {colors(p.color).alpha(0.2).css()};">
            <div class="flex items-center z-10 bg-transparent">
                <span class="inline-block p-2 cursor-move transform hover:scale-125 transition-transform" on:mousedown={(e) => dispatch('drag', e) }>
                    <Pin color={p.color ?? 'red'} size="32"/>
                </span>
                <span class="text-{p.title.length > 15 ? '' : '3'}xl font-bold w-full overflow-hidden whitespace-nowrap block max-w-full">
                    <AnimatedText fade={false} text={p.title} paused={scrollPaused}/>
                </span>
            </div>
            <div class="remove-pin absolute top-0 right-0 z-10 opacity-0 cursor-pointer transition-all inline-block" style="transform: translate(30%, -30%);"
                on:mousedown={(e) => {e.stopImmediatePropagation(); dispatch('remove')}}>
                <span class="lnr lnr-circle-minus text-xl text-white" ></span>
            </div>
        </div>
    </div>
</div>