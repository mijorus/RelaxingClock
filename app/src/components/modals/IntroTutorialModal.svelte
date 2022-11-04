<script lang="ts">
import { windowReady } from "html-ready";
import { fly, slide } from "svelte/transition";
import { modalContent, tips } from "../../stores/globalState";
import { summoned } from "../../stores/rooster";
import Key from "../elements/Key.svelte";
import Action from "../elements/settings/Buttons/Action.svelte";
import TutorialElement from "./components/TutorialElement.svelte";
import TutorialStep from "./components/TutorialStep.svelte";

    let step = 0;
    $: handleStepChange(step);

    function handleStepChange(step: number) {
        if (step === 2) {
            document.getElementById('rooster-command')?.focus();
        } else if (step === 7) {
            tips.set([{shortcut: 'Here', 'name': 'Look at me! 🙌'}]);
        } else {
            tips.set(null);
        }
    }
</script>

{#await windowReady then _}
    <div class="flex flex-col justify-between w-full h-full font-ubuntu">
        <div class="h-full md:w-4/5 m-auto"> 
            {#if step === 0}
                <TutorialStep>
                    <div><img class="-mt-10 mb-20 w-2/5 m-auto" src="/media/relaxing-clock-logo-transparent-smile.svg" alt="logo"/></div>
                    <TutorialElement customClass="text-center" index="1">
                        <h2 class="text-5xl font-title">Hi, welcome to Relaxing Clock</h2>
                        <TutorialElement customClass="mt-10 text-3xl" index="2">
                            Many things have changed since last time, may I show you what's new?
                        </TutorialElement>
                    </TutorialElement>
                </TutorialStep>
            {:else if step === 1}
                <TutorialStep >
                    <div class="text-center">
                        <h2 class="text-5xl font-title">Introducing, the command box</h2>
                        <TutorialElement customClass="mt-10 text-3xl" index="1">
                            A new way of interacting with the app.
                        </TutorialElement>
                        <TutorialElement customClass="mt-6 text-2xl" index="2">
                            <Key key="ctrl"/><Key key="space"/>
                        </TutorialElement>
                        <TutorialElement customClass="mt-6" index="3">
                            {#if $summoned}
                                <h3 class="text-green-400 text-3xl font-title">Well done! 👍</h3>
                            {:else}
                                <h3 class="text-3xl font-title">Try it now!</h3>
                            {/if}
                        </TutorialElement>
                    </div>
                </TutorialStep>
            {:else if step === 2}
                <TutorialStep >
                    <div class="text-center">
                        <h2 class="text-5xl font-title">Use it to control Relaxing Clock</h2>
                        <TutorialElement customClass="mt-10 text-3xl" index="1">
                            The command box can do a lot! An example? Set and manage remiders without lifting the fingers from the keyboard!
                        </TutorialElement>
                        <TutorialElement customClass="mt-10 text-xl" index="2">
                            Type "<span class="text-blue-300">reminder:</span> create play some games"<br>
                            Or maybe "<span class="text-yellow-600">alarm:</span> set 16:20"<br>
                            Not enought? "<span class="text-red-300">pin:</span> Just stay there!"<br><br>
                            <em>More on all of that later, keep reading</em>
                        </TutorialElement>
                    </div>
                </TutorialStep>
            {:else if step === 3}
                <TutorialStep >
                    <div class="text-center">
                        <h2 class="text-5xl font-title">Choose your soundtrack 🎧! Directly from Spotify!</h2>
                        <TutorialElement customClass="mt-10 text-3xl" index="1">
                            Are you a premium user? The <span class="text-spotify">Spotify</span> integration allows you to pick your favourite album or playlist while working or just browsing the web
                        </TutorialElement>
                        <TutorialElement customClass="mt-10 text-xl" index="2">
                            Explore a list of <em>"Playlists for you"</em> or search that lofi collection you enjoy with the command box
                        </TutorialElement>
                    </div>
                </TutorialStep>
            {:else if step === 4}
                <TutorialStep >
                    <div class="text-center">
                        <h2 class="text-5xl font-title">Need to be productive? <span class="text-red-300">Pomodoro</span> timer to the rescue!</h2>
                        <TutorialElement customClass="mt-10 text-3xl" index="1">
                            <span class="text-7xl"> <i id="pomodoro-icon"><span class="icon-tomato-22"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></span></i></span><br>
                            Split your time efficiently with the pomodoro cycles.
                        </TutorialElement>
                    </div>
                </TutorialStep>
            {:else if step === 5}
                <TutorialStep >
                    <div class="text-center">
                        <h2 class="text-5xl font-title">Do you need to quickly annotate something for later? Just set a <span class="text-blue-300">reminder</span>!</h2>
                        <TutorialElement customClass="mt-10 text-2xl" index="1">
                            Futhermore, <strong>persistent reminders</strong> will not expire the first time and they keep sending you notifications until you manually dismiss them: so don't worry if you are too busy to do it now, you won't forget that important call!
                        </TutorialElement>
                    </div>
                </TutorialStep>
            {:else if step === 6}
                <TutorialStep >
                    <div class="text-center">
                        <h2 class="text-5xl font-title">Do more with keyboard shortcuts! 🤓</h2>
                        <TutorialElement customClass="mt-10 text-3xl" index="1">
                            I've scattered shortcuts all over the place so that you can call all the important features quickly. <br>
                            For example:
                        </TutorialElement>
                        <TutorialElement customClass="mt-10 text-xl" index="2">
                            <strong>Ctrl + R</strong> Open the command box to set a reminder <br>
                            <strong>Ctrl + Shift + P</strong> Create a new pinned message <br><br>
                            <em><strong>For Spotify:</strong></em><br>
                            <strong>Ctrl + M</strong> Search a playlist on Spotify
                        </TutorialElement>
                    </div>
                </TutorialStep>
            {:else if step === 7}
                <TutorialStep >
                    <div class="text-center">
                        <h2 class="text-5xl font-title">Did you miss something? 🤔</h2>
                        <TutorialElement customClass="mt-10 text-3xl" index="1">
                            <Key key="?" /><br>
                            You can open the help modal by pressing '?' at any time<br><br>
                        </TutorialElement>
                        <TutorialElement customClass="mt-10 text-xl" index=2 >
                            Also, keep an eye on the bottom-right size of the screen, where many contextual tips will be shown and <b>check out <a href="blog.relaxingclock.it" class="underline">the blog</a></b>
                            where many tutorials and updates are posted.
                        </TutorialElement>
                    </div>
                </TutorialStep>
            {:else if step === 8}
                <TutorialStep >
                    <div class="text-center">
                        <h2 class="text-5xl font-title">That's it for today 🤗</h2>
                        <h2 class="text-7xl font-title">Enjoy Relaxing Clock!</h2>
                    </div>
                </TutorialStep>
            {/if}
        </div>
        <footer class="flex flex-col justify-center justify-self-end bg-primary z-10">
            <div class="flex justify-center mb-3">
                {#each Array(9) as _, index}
                    <i class="mx-1 fas fa-circle {step === index ? 'text-primary' : 'text-secondary'} text-xxs cursor-pointer" on:click={() => step = index}></i>
                {/each}
            </div>
            <div class="flex flex-row justify-center justify-self-end">
                <Action label="skip" custom customClass="border-2 border-primary bg-transparent mx-8" on:click={() => modalContent.set(null)}/>
                <Action label="back" customClass="border-2 border-transparent bg-transparent mx-2 {step > 0 ? '' : 'cursor-not-allowed'}" custom 
                    on:click={() => step === 0 ? 0 : step--} />
                <Action label="{step < 8 ? 'next slide' : 'close'}" on:click={() => step < 8 ? step++ : modalContent.set(null)} />
            </div>
        </footer>
    </div>
{/await}