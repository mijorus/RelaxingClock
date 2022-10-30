<script lang="ts">
    import { documentReady, windowReady } from "html-ready";
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import anime from "animejs";
    import Loader from "../elements/Loader.svelte";

    let isLoading = true;
    const paddingTime = 750;

    onMount(async () => {
        await documentReady;
        await windowReady;

        setTimeout(() => {
            isLoading = false;
        }, paddingTime);
    });
</script>

{#if isLoading}
    <div class="flex flex-col items-center justify-center text-primary w-full h-full fixed top-0 bg-tertiary rounded-b-2xl pointer-events-none" style="z-index: 999;" transition:slide>
        <img class="w-6/12 md:w-3/12 lg:w-2/12 mb-0 md:mb-0" src="/media/relaxing-clock-logo-transparent-smile.svg" alt="" />
        <div class="lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
        </div>
    </div>

    <style>
        .lds-ellipsis {
            display: inline-block;
            position: relative;
            width: 80px;
            height: 80px;
        }
        .lds-ellipsis div {
            position: absolute;
            top: 33px;
            width: 13px;
            height: 13px;
            border-radius: 50%;
            background: #fff;
            animation-timing-function: cubic-bezier(0, 1, 1, 0);
        }
        .lds-ellipsis div:nth-child(1) {
            left: 8px;
            animation: lds-ellipsis1 0.6s infinite;
        }
        .lds-ellipsis div:nth-child(2) {
            left: 8px;
            animation: lds-ellipsis2 0.6s infinite;
        }
        .lds-ellipsis div:nth-child(3) {
            left: 32px;
            animation: lds-ellipsis2 0.6s infinite;
        }
        .lds-ellipsis div:nth-child(4) {
            left: 56px;
            animation: lds-ellipsis3 0.6s infinite;
        }
        @keyframes lds-ellipsis1 {
            0% {
                transform: scale(0);
            }
            100% {
                transform: scale(1);
            }
        }
        @keyframes lds-ellipsis3 {
            0% {
                transform: scale(1);
            }
            100% {
                transform: scale(0);
            }
        }
        @keyframes lds-ellipsis2 {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(24px, 0);
            }
        }
    </style>
{/if}
