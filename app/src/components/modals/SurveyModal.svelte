<script lang="ts">
import { windowReady } from "html-ready";
import { fly, slide } from "svelte/transition";
import { modalContent, tips } from "../../stores/globalState";
import { summoned } from "../../stores/rooster";
import Key from "../elements/Key.svelte";
import Action from "../elements/settings/Buttons/Action.svelte";
import TutorialElement from "./components/TutorialElement.svelte";
import TutorialStep from "./components/TutorialStep.svelte";

</script>

{#await windowReady then _}
    <div class="flex flex-col items-center justify-center w-full h-full font-ubuntu p-3">
        <div class="text-3xl text-center">
            Do you mind taking a quick survey to imporove Relaxing Clock?
        </div>
        <div class="my-10 text-center text-2xl">
            We need you feedback to keep improving this project! <br>Take a quick survey by visiting the link below
        </div>
        <a class="text-3xl text-underline underline text-yellow-300" href="https://forms.gle/o2CV4tL7R29Np1bk6" target="_blank">https://forms.gle/o2CV4tL7R29Np1bk6</a>
        <div class="my-10 text-center text-2xl">
            If you dismiss this message, you can visit the form <br>at any time by clicking on "Take a survey" from the button below
        </div>
    </div>
{/await}