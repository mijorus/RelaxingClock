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
    import colors from "simple-color-functions";
    import { notifications } from "../../../stores/notifications";
    import { bgImageBright, pinnedDBisReady } from "../../../stores/globalState";
    import { getRandomIntInclusive } from "../../../utils/utils";
    import PinBubble from "./PinBubble.svelte";

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

        const res = PinnedDB.create({ title, done: false });
        await refreshPinned();
        return res;
    }

    async function releasePinBubble() {
        if (!selectedElement || window.getComputedStyle(selectedElement).display === "none") return;

        selectedElement.classList.remove("is-moving");
        const selY = parseInt(anime.get(selectedElement, "translateY").toString());
        const selX = parseInt(anime.get(selectedElement, "translateX").toString());

        let animation = null;
        if (selY > pinBox.clientHeight || selX > pinBox.clientWidth) {
            animation = anime({
                targets: selectedElement,
                translateX: selX > pinBox.clientWidth ? pinBox.clientWidth - bubblePinPos / 2 : selX,
                translateY: selY > pinBox.clientHeight ? pinBox.clientHeight - bubblePinPos / 2 : selY,
                duration: 200,
                easing: eaElasticDefault,
            });
        }

        if (animation) await animation.finished;
        PinnedDB.setCoord(parseInt(selectedElement.dataset.id), parseInt(anime.get(selectedElement, "translateY").toString()), parseInt(anime.get(selectedElement, "translateX").toString()));
        selectedElement = null;
        scrollPaused = false;
        return true;
    }

    async function removePin(id: number) {
        notifications.create({
            title: "Pin removed",
            content: (await PinnedDB.get(id)).title + " was dismissed",
            sound: false,
            limitDisplay: "sidePanelOnly",
            icon: "lnr lnr-pushpin",
        });

        await PinnedDB.setDone(id);
        refreshPinned();
    }

    function bringElementUp(el: HTMLElement) {
        if (!el) return;
        document.querySelectorAll(".pinned").forEach((el) => el.classList.remove("z-10"));
        el.classList.add("z-10", "is-moving");
    }

    function handleMouseDown(e: MouseEvent, index: number) {
        e.preventDefault();
        e.stopPropagation();

        selectedElement = document.getElementById("pinned-" + index);
        bringElementUp(selectedElement);
        scrollPaused = true;

        anime({
            targets: selectedElement,
            duration: 40,
            easing: "linear",
            translateY: e.clientY - selectedElement.clientHeight / 2,
            translateX: e.clientX - bubblePinPos,
        });
    }

    function handleDragOnMouseMove(e: MouseEvent) {
        if (!selectedElement || !readyToMove) return;
        selectedElement.style.transform = `translateY(${e.clientY - selectedElement.clientHeight / 2}px) translateX(${e.clientX - bubblePinPos}px)`;
    }

    let resizeTimeout;
    function getPinBoxSize() {
        if (pinned.length) {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(async () => {
                for (let p of pinned) {
                    selectedElement = document.getElementById("pinned-" + p.id);
                    await releasePinBubble().catch((e) => console.log(e));
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
            window.addEventListener("mouseup", () => {
                if (pinnedDBisReady && selectedElement) releasePinBubble();
            });

            shortcuts.set("pin", {
                color: "#fff",
                background: "#c80000",
                arguments: {
                    "": {
                        description: "Create a new pinned message straight-away",
                        active: true,
                        hideInModal: false,
                        quickLaunch: "P",
                        async callback(p) {
                            const res = await createPinned(p);
                            if (res) {
                                await tick();
                                bringElementUp(document.getElementById("pinned-" + res));
                            }

                            return res !== false;
                        },
                    },
                },
                async examples(arg, p) {
                    return {
                        group: [{ argument: "pin:", example: "", tip: "Create a new pinned message, up to " + maxPinsN }],
                    };
                },
            });

            // await windowReady
            readyToMove = true;
        }
    });
</script>

<svelte:window on:resize={getPinBoxSize} />
{#if pinnedDBisReady}
    <div
        bind:this={pinBox}
        class="hidden md:block md:w-104 xl:w-132 md:h-44 xl:h-60 z-10 pin-box transition-all border
        {pinned.length ? ($bgImageBright !== '' ? 'border-primary' : 'border-secondary') : 'border-transparent'} {$bgImageBright !== ''
            ? 'hover:border-primary'
            : 'hover:border-secondary'} rounded-xl m-3"
        on:mousemove={handleDragOnMouseMove}
    >
        {#each pinned as p, i (p.id)}
            <PinBubble scrollPaused {p} on:drag={(e) => handleMouseDown(e.detail, p.id)} on:remove={() => removePin(p.id)} on:focus={() => bringElementUp(document.getElementById("pinned-" + p.id))} />
        {/each}

        <div
            class="transition-all -z-1 w-full absolute bottom-0 pt-10 opacity-0 transform
            translate-y-1/2 text-center whitespace-nowrap pinned-hint {$bgImageBright !== '' ? 'text-white' : 'text-secondary'}"
        >
            Keep your pins inside this box! {#if !pinned.length}<br />Type <strong>pin: [space]</strong> in the command box{/if}
        </div>
    </div>
    <div class="pinned-box-sm block md:hidden border" style="position: absolute; top: 0px;">
        {#each pinned as p, i (p.id)}
            <div class="absolute rounded-full w-12 h-12 bg-black" style="transform: translate(5px, {5 + i * 10}px);">
                <div class="flex justify-center items-center w-full h-full rounded-full" style="background-color: {colors(p.color).alpha(0.2).css()};">
                    <Pin color={p.color ?? "red"} size="28" />
                </div>
            </div>
        {/each}
    </div>
{/if}

<style>
    :global(.pinned .pinned-inner) {
        transform: scale(1);
        border: transparent !important;
        transition: transform 0.1s ease-in-out;
    }

    :global(.pinned.is-moving .pinned-inner) {
        transform: scale(1.1);
    }

    .pin-box:hover .pinned-hint {
        opacity: 100% !important;
    }

    .pinned-box-sm {
        animation: reveal 0.2s linear;
    }

    @keyframes reveal {
        0% {
            opacity: 0;
            transform: translateX(-20%);
        }
        100% {
            opacity: 1;
            transform: translateX(0%);
        }
    }
</style>
