<script lang="ts">
    import { windowReady } from "html-ready";
    import { altLabel } from "../../costants";

    const version = process.env.VERSION;
</script>

{#await windowReady then _}
    <div class="flex flex-col items-center justify-center w-full font-ubuntu p-3">
        <div class="text-4xl mb-10 text-center">
            <b>Relaxing Clock</b> update {version}
        </div>
        {#if version === "4.1.0" || version === "4.1.1" || version === "4.2.0"}
            <div class="my-3 mb-10">
                <ul>
                    <li>- Fixed an error when creating alarms with 12h format</li>
                </ul>
            </div>
            <div class="my-3">
                <img class="border rounded-xl border-white" src="/media/genius-search.gif" alt="verison 4.1.0" />
            </div>
            <div class="mb-10 text-center text-2xl">Search lyrics from Genius</div>
            <div class="my-3">
                <img class="border rounded-xl border-white" src="/media/4-1-0.gif" alt="verison 4.1.0" />
            </div>
            <div class="mb-10 text-center text-2xl">Check the status of ongoing timers and reminders with the new widget.</div>
            <div class="my-3">
                <img class="border-2 rounded-xl border-white" src="/media/4-1-0-protips.png" alt="verison 4.1.0" />
            </div>
            <div class="mb-10 text-center text-2xl">Discover Tips and tricks you didn't know about</div>
            <div class="my-3">
                <img class="border-2 rounded-xl border-white" src="/media/4-1-0-kofi.png" alt="verison 4.1.0" />
            </div>
            <div class="mb-10 text-center text-2xl">Enjoying Relaxing Clock? Send me a kofi.</div>
        {:else if version === "4.4.0"}
            <div class="my-3">
                <ul>
                    <li>- ✒️Added an option to customize the font style of the clock</li>
                </ul>
            </div>
        {:else if version === "4.5.0"}
            <div class="my-3 mx-auto">
                <img src="/media/rc-update-bg.gif" alt="relaxing clock 4.5.0" class="mx-auto rounded-xl" />
                <ul>
                    <li class="mt-10">
                        <div class="text-xl">Background Customization!</div>
                        <p>
                            Relaxing Clock now has finally an option to customize its background!<br />Scroll down into the settings and choose between the bing daily image or explore the full
                            Unsplash catalog.
                        </p>
                    </li>
                    <li class="mt-10">
                        <div class="text-xl">QOL update</div>
                        <p>
                            Start the Pomodoro timer with a new shortcut: {altLabel} + f
                        </p>
                    </li>
                    <li class="mt-10">
                        <div class="text-xl">Minor UI tweaks</div>
                        <p>
                            You can now see the relative shortcuts directly from the menu
                        </p>
                    </li>
                </ul>
            </div>
        {:else}
            <div class="my-3">
                <ul>
                    <li>- Bug fix and improvements</li>
                </ul>
            </div>
        {/if}
    </div>
{/await}
