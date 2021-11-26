<script lang="ts">
import { windowReady } from "html-ready";
import { fly, slide } from "svelte/transition";
import { modalContent } from "../../stores/globalState";
import { summoned } from "../../stores/rooster";
import Key from "../elements/Key.svelte";
import Action from "../elements/settings/Buttons/Action.svelte";
import TutorialStep from "./components/TutorialStep.svelte";

    const defaultAnimationConfig = {y: -20, duration: 1500};
    
    let step = 0;
    $: handleStepChange(step);

    function handleStepChange(step: number) {
        if (step === 2) {
            // summoned.set(false);
        }
    }
</script>

{#await windowReady then _}
    <div class="flex flex-col justify-center w-full h-full">
        {#if step === 0}
            <TutorialStep animate={false}>
                <div><img class="-mt-10 mb-20 w-2/5 m-auto" src="/media/relaxing-clock-logo-transparent-smile.svg" alt="logo"/></div>
                <div class="text-center" in:fly={{...defaultAnimationConfig, delay: 1000}}>
                    <h2 class="text-5xl font-title">Hi, welcome to Relaxing Clock</h2>
                    <p class="mt-10 text-3xl" in:fly={{...defaultAnimationConfig, delay: 2500}}>
                        Many things have chaged since last time, may I show you what's new?
                    </p>
                </div>
            </TutorialStep>
        {:else if step === 1}
            <TutorialStep >
                <div class="text-center">
                    <h2 class="text-5xl font-title">Introducing, the command box</h2>
                    <p class="mt-10 text-3xl" in:fly={{...defaultAnimationConfig, delay: 1500}}>
                        A new way of interacting with the app.
                    </p>
                    <div class="mt-6 text-2xl" in:fly={{...defaultAnimationConfig, delay: 2500}}>
                        <Key key="ctrl"/><Key key="space"/>
                    </div>
                    <div class="mt-6" in:fly={{...defaultAnimationConfig, delay: 3000}}>
                        {#if $summoned}
                            <h3 class="text-green-400 text-3xl font-title">Well done! 👍</h3>
                        {:else}
                            <h3 class="text-3xl font-title">Try it now!</h3>
                        {/if}
                    </div>
                </div>
            </TutorialStep>
        {:else if step === 2}
            <TutorialStep >
                <div class="text-center">
                    <h2 class="text-5xl font-title">Use it to control Relaxing Clock</h2>
                    <p class="mt-10 text-3xl" in:fly={{...defaultAnimationConfig, delay: 1500}}>
                        The command box can do a lot! An example? Set and manage remiders without lifting the fingers from the keyboard!
                    </p>
                    <p class="mt-10 text-xl" in:fly={{...defaultAnimationConfig, delay: 2500}}>
                        Type "<span class="text-blue-300">remider:</span> create play some games"<br>
                        Or maybe "<span class="text-yellow-600">alarm:</span> set 16:20"<br>
                        Not enought? "<span class="text-red-300">pin:</span> Just stay there!"<br>
                    </p>
                </div>
            </TutorialStep>
        {/if}
        <div class="flex flex-row justify-center justify-self-end">
            <Action label="skip" custom customClass="border-2 border-primary bg-transparent mx-8" on:click={() => modalContent.set(null)}/>
            <Action label="back" customClass="border-2 border-transparent bg-transparent mx-2 {step > 0 ? '' : 'cursor-not-allowed'}" custom 
                on:click={() => step === 0 ? 0 : step--} />
            <Action label="next slide" on:click={() => step++} />
        </div>
    </div>
{/await}