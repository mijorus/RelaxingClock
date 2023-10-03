<script lang="ts">
import { windowReady } from "html-ready";
    import { surveyUrl } from "../../costants";

</script>

{#await windowReady then _}
    <div class="flex flex-col items-center justify-center w-full h-full font-ubuntu p-3">
        <div class="text-3xl text-center">
            Do you mind taking a quick survey to imporove Relaxing Clock?
        </div>
        <div class="my-10 text-center text-2xl">
            We need you feedback to keep improving this project! <br>Take a quick survey by visiting the link below
        </div>
        <a class="text-3xl text-underline underline text-yellow-300" href={surveyUrl} target="_blank">{surveyUrl}</a>
        <div class="my-10 text-center text-2xl">
            If you dismiss this message, you can visit the form <br>at any time by clicking on "Take a survey" from the button below
        </div>
    </div>
{/await}