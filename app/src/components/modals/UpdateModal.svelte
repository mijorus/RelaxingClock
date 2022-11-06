<script lang="ts">
    import { windowReady } from "html-ready";
</script>

{#await windowReady then _}
    <div class="flex flex-col items-center justify-center w-full font-ubuntu p-3">
        <div class="text-4xl mb-10 text-center">
            <b>Relaxing Clock</b> update 4.1.0
        </div>
        <div class="my-3 w-1/2"  >
            <img class="border rounded-xl border-white" src="/media/4-1-0.gif" alt="verison 4.1.0">
        </div>
        <div class="mb-10 text-center text-2xl">
            Check the status of ongoing timers and reminders with the new widget.
        </div>
        <div class="my-3 w-1/2  ">
            <img class="border-2 rounded-xl border-white" src="/media/4-1-0-protips.png" alt="verison 4.1.0">
        </div>
        <div class="mb-10 text-center text-2xl">
            Discover Tips and tricks  you didn't know about
        </div>
        <div class="my-3 w-1/2  ">
            <img class="border-2 rounded-xl border-white" src="/media/4-1-0-kofi.png" alt="verison 4.1.0">
        </div>
        <div class="mb-10 text-center text-2xl">
            Enjoying Relaxing Clock? Send me a kofi.
        </div>
    </div>
{/await}
