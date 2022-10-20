<script lang="ts">
    import { windowReady } from "html-ready";
    import { modalContent } from "../../stores/globalState";
    import { activeStyle } from "../../stores/storedSettings";
    import Action from "../elements/settings/Buttons/Action.svelte";
</script>

{#await windowReady then _}
    <div class="flex flex-col items-center justify-center w-full h-full font-ubuntu p-3">
        <div class="text-6xl text-center">
            Introducing <b>Pixel</b>
        </div>
        <div class="my-10 text-center text-2xl">
            A new clock style inspired by the Pixel Watch <br />
            Check it out!
        </div>
        <div>
            <Action label="Set Pixel" on:click={() => {
                activeStyle.set(5)
                modalContent.set(null)
            }}/>
        </div>
    </div>
{/await}
