<script lang="ts">
import { onMount } from "svelte";
import { PinnedDB } from "../../../handlers/PinnedDB";
import type { StoredPinned } from "../../../handlers/PinnedDB";
import { shortcuts } from "../../../stores/rooster";
import Bubble from "../../elements/Bubble.svelte";
import Pin from "../../icons/Pin.svelte";
import { windowReady } from "html-ready";
import anime from "animejs";
import { outerHeight, outerWidth, sleep } from "../../../utils/utils";
import { fade, scale } from "svelte/transition";
import AnimatedText from "../../elements/AnimatedText.svelte";
    
    let pinned: StoredPinned[] = [];
    let selectedElement: HTMLElement;
    let pinBox: HTMLElement;
    let readyToMove = false;

    async function refreshPinned() {
        pinned = await PinnedDB.getAllActive();
    } 

    function createPinned(title: string) {
        if (pinned.length >= 4 || title.length > 50) return false;
        
        const res = PinnedDB.create({ title, 'done': false});
        refreshPinned();
        return res;
    }

    function releasePinBubble() {
         if (selectedElement) {
            PinnedDB.setCoord(parseInt(selectedElement.dataset.id), parseInt(selectedElement.style.top), parseInt(selectedElement.style.left));
            selectedElement = null;
         }
    }

    async function removePin(id: number) {
        await PinnedDB.setDone(id);
        refreshPinned();
    }

    function handleMouseDown(e: MouseEvent, index: number) {
        e.preventDefault();
        e.stopPropagation();

        selectedElement = document.getElementById('pinned-'+index);
    }

    function handleDragOnMouseMove(e: MouseEvent) {
        if (!selectedElement || !readyToMove) return;

        if (e.clientX <= outerWidth(pinBox) && e.clientY <= outerHeight(pinBox)) {
            selectedElement.style.top = (e.clientY - (selectedElement.clientHeight / 2))+'px';
            selectedElement.style.left = (e.clientX - 30) +'px';
        } else {
            const bounceParams = [10, -10, 0];
            let params: any = {
                targets: selectedElement,
                duration: 200,
                easing: 'linear',
            };

            releasePinBubble();
            (e.clientX > pinBox.clientWidth) ? params.translateX = bounceParams : params.translateY = bounceParams;
            anime(params);
        }
    }

    onMount(async () => {
        await PinnedDB.initDB();
        await refreshPinned();

        shortcuts.set('pin', {
            'color': '#fff',
            'background': '#c80000',
            'arguments': {
                '': {
                    'active': true,
                    'quickLaunch': 'P',
                    async callback(p) {
                        const res = await createPinned(p);
                        return res !== false;
                    }
                }
            }
        });

        windowReady.then(() => readyToMove = true);
    });
</script>

<svelte:window on:mouseup={() => releasePinBubble()} />

<div bind:this={pinBox} class="h-60 pin-box transition-all border border-transparent hover:border-secondary rounded-xl m-3" style="width: 32rem;" on:mousemove={handleDragOnMouseMove}>
    {#each pinned as p, i}
        <div id="pinned-{p.id}" data-id={p.id} class="absolute top-0 left-0 cursor-move pinned" on:mousedown={(e) => handleMouseDown(e, p.id)}
                transition:scale style="{p.top ? `top: ${p.top}px` : ''}; {p.left ? `left: ${p.left}px` : ''} ">
            <Bubble classes="bg-tertiary">
                <div class="flex items-center">
                    <span class="p-2"><Pin color={p.color ?? 'red'} size="32"/></span>
                    <span class="text-{p.title.length > 15 ? '2' : '3'}xl font-bold w-full overflow-hidden whitespace-nowrap block max-w-full"><AnimatedText fade={false} text={p.title}/></span>
                </div>
                <div class="remove-pin absolute top-0 right-0 opacity-0 cursor-pointer transition-all inline-block" style="transform: translate(30%, -30%);"
                    on:click={() => removePin(p.id)}>
                    <span class="lnr lnr-circle-minus text-xl text-red-500" ></span>
                </div>
            </Bubble>
        </div>
    {/each}

    <div class="transition-all -z-1 w-full absolute bottom-0 opacity-0 transform translate-y-1/2 text-center text-secondary whitespace-nowrap pinned-hint">
        Keep your pins inside this box! {#if !pinned.length}Type <strong>pin: [space]</strong> in the Rooster{/if}
    </div>
</div>

<style>
    .pinned {
        will-change: top, left, transform;
        /* transition: all .005s linear; */
    }

    .pinned:hover .remove-pin{
        opacity: 100% !important;
    }

    .pin-box:hover .pinned-hint {
        opacity: 100% !important;
    }
</style>