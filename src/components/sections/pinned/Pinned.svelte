<script lang="ts">
import { onMount } from "svelte";
import { PinnedDB } from "../../../handlers/PinnedDB";
import type { StoredPinned } from "../../../handlers/PinnedDB";
import { shortcuts } from "../../../stores/rooster";
import Bubble from "../../elements/Bubble.svelte";
import Pin from "../../icons/Pin.svelte";
import { windowReady } from "html-ready";
import anime from "animejs";
import { fade, scale } from "svelte/transition";
import AnimatedText from "../../elements/AnimatedText.svelte";
import { eaElasticDefault } from "../../../utils/animations";
import colors  from "simple-color-functions";

    let pinned: StoredPinned[] = [];
    let selectedElement: HTMLElement;
    let pinBox: HTMLElement;
    let readyToMove = false;
    let scrollPaused = false;

    async function refreshPinned() {
        pinned = await PinnedDB.getAllActive();
    }

    function createPinned(title: string) {
        if (pinned.length >= 5 || title.length > 50) return false;

        const res = PinnedDB.create({ title, 'done': false});
        refreshPinned();
        return res;
    }

    async function releasePinBubble() {
        if (!selectedElement) return;
     
        const selY = parseInt(anime.get(selectedElement, 'translateY'));
        const selX = parseInt(anime.get(selectedElement, 'translateX'));
        
        let animation = null;
        if (selY > pinBox.clientHeight || selX > pinBox.clientWidth) {
            animation = anime({
                targets: selectedElement,
                translateX: selX > pinBox.clientWidth ? pinBox.clientWidth : selX,
                translateY: selY > pinBox.clientHeight ? pinBox.clientHeight : selY,
                duration: 200,
                easing: eaElasticDefault
            });
        }
        
        if (animation) await animation.finished;
        PinnedDB.setCoord(parseInt(selectedElement.dataset.id), parseInt(anime.get(selectedElement, 'translateY')), parseInt(anime.get(selectedElement, 'translateX')));
        selectedElement = null;
        scrollPaused = false;
    }

    async function removePin(id: number) {
        await PinnedDB.setDone(id);
        refreshPinned();
    }

    function handleMouseDown(e: MouseEvent, index: number) {
        e.preventDefault();
        e.stopPropagation();

        selectedElement = document.getElementById('pinned-'+index);
        document.querySelectorAll('.pinned').forEach(el => el.classList.remove('z-10'));
        selectedElement.classList.add('z-10');
        scrollPaused = true;

        anime({
            targets: selectedElement,
            duration: 25,
            easing: 'linear', translateY: (e.clientY - (selectedElement.clientHeight / 2)), translateX: (e.clientX - (selectedElement.clientWidth / 4))
        });
    }

    function handleDragOnMouseMove(e: MouseEvent) {
        if (!selectedElement || !readyToMove) return;
        selectedElement.style.transform = `translateY(${(e.clientY - (selectedElement.clientHeight / 2))}px) translateX(${(e.clientX - (selectedElement.clientWidth / 4))}px)`;
    }

    onMount(async () => {
        await PinnedDB.initDB();
        await refreshPinned();
        await PinnedDB.dbCleanUp();

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

<div bind:this={pinBox} class="z-10 pin-box transition-all border {pinned.length ? 'border-secondary': 'border-transparent'} hover:border-secondary rounded-xl m-3" 
    style="width: 33rem; height: 15rem" on:mousemove={handleDragOnMouseMove}>
    {#each pinned as p, i}
        <div id="pinned-{p.id}" data-id={p.id} class="absolute top-0 left-0 cursor-move pinned"
            on:mousedown={(e) => handleMouseDown(e, p.id)} in:scale style="transform: translateY({p.top ?? 0}px) translateX({p.left ? `${p.left}px` : '0'})">
            <Bubble classes="bg-black relative">
                <div class="absolute top-0 left-0 w-full h-full rounded-2xl" style="background-color: {colors(p.color).alpha(0.2).css()};"></div>
                <div class="flex items-center" >
                    <span class="p-2"><Pin color={p.color ?? 'red'} size="32"/></span>
                    <span class="text-{p.title.length > 15 ? '' : '3'}xl font-bold w-full overflow-hidden whitespace-nowrap block max-w-full"><AnimatedText fade={false} text={p.title} paused={scrollPaused}/></span>
                </div>
                <div class="remove-pin absolute top-0 right-0 z-10 opacity-0 cursor-pointer transition-all inline-block" style="transform: translate(30%, -30%);"
                    on:mousedown={(e) => {e.stopImmediatePropagation(); removePin(p.id)}}>
                    <span class="lnr lnr-circle-minus text-xl text-white" ></span>
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
        will-change: transform;
    }

    .pinned:hover .remove-pin{
        opacity: 100% !important;
    }

    .pin-box:hover .pinned-hint {
        opacity: 100% !important;
    }
</style>