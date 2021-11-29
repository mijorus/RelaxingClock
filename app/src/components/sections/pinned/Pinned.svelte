<script lang="ts">
import { onMount, tick } from "svelte";
import { PinnedDB } from "../../../handlers/PinnedDB";
import type { StoredPinned } from "../../../handlers/PinnedDB";
import { shortcuts } from "../../../stores/rooster";
import Pin from "../../icons/Pin.svelte";
import { windowReady } from "html-ready";
import anime from "animejs";
import { fade, scale } from "svelte/transition";
import AnimatedText from "../../elements/AnimatedText.svelte";
import { eaElasticDefault } from "../../../utils/animations";
import colors  from "simple-color-functions";
import { notifications } from "../../../stores/notifications";
import { pinnedDBisReady } from "../../../stores/globalState";

    let pinned: StoredPinned[] = [];
    let adjustedPinned: StoredPinned[] = [];
    let selectedElement: HTMLElement;
    let pinBox: HTMLElement;
    let readyToMove = false;
    let scrollPaused = false;
    const bubblePinPos = 50;
    const maxPinsN = 10;

    async function refreshPinned() {
        pinned = await PinnedDB.getAllActive();
    }

    async function createPinned(title: string) {
        if (pinned.length >= maxPinsN || title.length > 50) return false;

        const res = PinnedDB.create({ title, 'done': false});
        await refreshPinned();
        return res;
    }

    async function releasePinBubble() {
        if (!selectedElement || window.getComputedStyle(selectedElement).display === 'none') return;
        
        selectedElement.classList.remove('is-moving');
        const selY = parseInt(anime.get(selectedElement, 'translateY').toString());
        const selX = parseInt(anime.get(selectedElement, 'translateX').toString());
        
        let animation = null;
        if (selY > pinBox.clientHeight || selX > pinBox.clientWidth) {
            animation = anime({
                targets: selectedElement,
                translateX: selX > pinBox.clientWidth ? pinBox.clientWidth - (bubblePinPos / 2) : selX,
                translateY: selY > pinBox.clientHeight ? pinBox.clientHeight - (bubblePinPos / 2) : selY,
                duration: 200,
                easing: eaElasticDefault
            });
        }
        
        if (animation) await animation.finished;
        PinnedDB.setCoord(parseInt(selectedElement.dataset.id), parseInt(anime.get(selectedElement, 'translateY').toString()), parseInt(anime.get(selectedElement, 'translateX').toString()));
        selectedElement = null;
        scrollPaused = false;
        return true;
    }

    async function removePin(id: number) { 
        notifications.create({
            title: 'Pin removed',
            content: (await PinnedDB.get(id)).title + ' was dismissed',
            sound: false,
            limitDisplay: 'sidePanelOnly',
            icon: 'lnr lnr-pushpin',
        });
        
        await PinnedDB.setDone(id);
        refreshPinned();
    }

    function bringElementUp(el: HTMLElement) {
        if (!el) return;
        document.querySelectorAll('.pinned').forEach(el => el.classList.remove('z-10'));
        el.classList.add('z-10', 'is-moving');
    }

    function handleMouseDown(e: MouseEvent, index: number) {
        e.preventDefault();
        e.stopPropagation();

        selectedElement = document.getElementById('pinned-'+index);
        bringElementUp(selectedElement);
        scrollPaused = true;

        anime({
            targets: selectedElement,
            duration: 40,
            easing: 'linear', 
            translateY: (e.clientY - (selectedElement.clientHeight / 2)), 
            translateX: (e.clientX - bubblePinPos)
        });
    }

    function handleDragOnMouseMove(e: MouseEvent) {
        if (!selectedElement || !readyToMove) return;
        selectedElement.style.transform = `translateY(${(e.clientY - (selectedElement.clientHeight / 2))}px) translateX(${(e.clientX - bubblePinPos)}px)`;
    }

    let resizeTimeout;
    function getPinBoxSize() {
        if (pinned.length) {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(async () => {
                for (let p of pinned) {
                    selectedElement = document.getElementById('pinned-'+p.id);
                    await releasePinBubble().catch(e => console.log(e));   
                }
            }, 750);
        }
    }

    onMount(async () => {
        try {
            await windowReady;
            await PinnedDB.initDB();
            await refreshPinned();
            await PinnedDB.dbCleanUp();
            pinnedDBisReady.set(true);
        } catch (e) {
            console.error(e);
        }

        if (pinnedDBisReady) {
            window.addEventListener('mouseup', () => {if (pinnedDBisReady && selectedElement) releasePinBubble()} );
            
            shortcuts.set('pin', {
                'color': '#fff',
                'background': '#c80000',
                'arguments': {
                    '': {
                        'active': true,
                        'quickLaunch': 'P',
                        async callback(p) {
                            const res = await createPinned(p);
                            if (res)  {
                                await tick();
                                bringElementUp(document.getElementById('pinned-'+res));
                            }

                            return res !== false;
                        }
                    }
                },
                async examples(arg, p) {
                    return {
                        'group': [{'argument': 'pin:', 'example': '', 'tip': 'Create a new pinned message, up to '+maxPinsN}]
                    }
                }
            });

            // await windowReady
            readyToMove = true;
        }
    });
</script>

<svelte:window on:resize={getPinBoxSize}/>
{#if pinnedDBisReady}
    <div bind:this={pinBox} class="hidden md:block md:w-104 xl:w-132 md:h-44 xl:h-60 z-10 pin-box transition-all border 
        {pinned.length ? 'border-secondary': 'border-transparent'} hover:border-secondary rounded-xl m-3" on:mousemove={handleDragOnMouseMove}>
        {#each pinned as p, i (p.id)}
            <div id="pinned-{p.id}" data-id={p.id} class="hidden md:block absolute top-0 left-0 pinned" on:mousedown|stopPropagation={() => bringElementUp(document.getElementById('pinned-'+p.id))}
                style="transform: translateY({p.top > 0 ? p.top :  0}px) translateX({p.left > 0 ? `${p.left}px` : '0'});">
                <div class="pinned-inner bg-black relative m-2 xl:m-6 rounded-2xl p-0 text-primary w-80" transition:scale>
                    <div class="pinned-bg p-3 rounded-2xl" style="background-color: {colors(p.color).alpha(0.2).css()};">
                        <div class="flex items-center z-10 bg-transparent">
                            <span class="inline-block p-2 cursor-move transform hover:scale-125 transition-transform" 
                                on:mousedown={(e) => handleMouseDown(e, p.id)}><Pin color={p.color ?? 'red'} size="32"/></span>
                            <span class="text-{p.title.length > 15 ? '' : '3'}xl font-bold w-full overflow-hidden whitespace-nowrap block max-w-full"><AnimatedText fade={false} text={p.title} paused={scrollPaused}/></span>
                        </div>
                        <div class="remove-pin absolute top-0 right-0 z-10 opacity-0 cursor-pointer transition-all inline-block" style="transform: translate(30%, -30%);"
                            on:mousedown={(e) => {e.stopImmediatePropagation(); removePin(p.id)}}>
                            <span class="lnr lnr-circle-minus text-xl text-white" ></span>
                        </div>
                    </div>
                </div>
            </div>
        {/each}

        <div class="transition-all -z-1 w-full absolute bottom-0 opacity-0 transform translate-y-1/2 text-center text-secondary whitespace-nowrap pinned-hint">
            Keep your pins inside this box! {#if !pinned.length}Type <strong>pin: [space]</strong> in the Rooster{/if}
        </div>
    </div>
{/if}

<style>
    .pinned {
        will-change: transform;
    }

    .pinned-bg {
        transition: .05s border linear;
        border: 2px solid transparent;
    }

    .pinned-bg:hover {
        border: 2px solid rgba(255, 255, 255, 0.5);
    }

   :global(.pinned .pinned-inner){
        transform: scale(1);
        border: transparent !important;
        transition: transform .1s ease-in-out;
    }

    :global(.pinned.is-moving .pinned-inner)  {
        transform: scale(1.1);
    }

    .pinned:hover .remove-pin{
        opacity: 100% !important;
    }

    .pin-box:hover .pinned-hint {
        opacity: 100% !important;
    }
</style>