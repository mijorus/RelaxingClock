<script lang="ts">
    import SettingsBox from "../../elements/SettingsBox.svelte";
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import Booleans from "../../elements/settings/Buttons/Booleans.svelte";
    import { backgroundImage, blink, saveEnergy } from "../../../stores/storedSettings";
    import { bgImageBright } from "../../../stores/globalState";

    let imageReference: HTMLImageElement;

    function setImageBrigthness() {
        imageReference.crossOrigin = "Anonymous";

        // create canvas
        var canvas = document.createElement("canvas");
        canvas.width = imageReference.width;
        canvas.height = imageReference.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(imageReference, 0, 0);

        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const worker = new Worker("/workers/imageBrigthness.js");

        worker.onmessage = (event) => {
            console.log("worker", event);

            const brightness = event.data < 127.5 ? "dark" : "light";
            console.log("Bg image is ", brightness, event.data);
            bgImageBright.set(brightness);
        };

        worker.postMessage({ imageData, canvas: { width: canvas.width, height: canvas.height } });
    }
</script>

<SettingsBox bordered={false} id="background-image">
    <Title title="Background image">
        <TitleIcon>
            <i class="lnr lnr-leaf text-green-500 settings-title-icon" />
        </TitleIcon>
    </Title>
    <PrimaryBox
        label={{ text: "Set a background image" }}
        description={{
            text: "Reduce motion and animations when the window in not in focus. Can help if your laptop is running on battery or you want to reduce the impact on your GPU",
            iconClass: "lnr lnr-question-circle",
        }}
        available={true}
    >
        <Booleans
            state={$backgroundImage?.length}
            label={"Background image"}
            on:change={(e) => {
                if (!e.detail) bgImageBright.set("");
                backgroundImage.set(e.detail ? "https://bing.com//th?id=OHR.VeniceSkatePark_EN-US1972530060_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp" : "");
            }}
        />
    </PrimaryBox>
</SettingsBox>

<!-- svelte-ignore a11y-missing-attribute -->
{#if $backgroundImage?.length}
    <img bind:this={imageReference} src={$backgroundImage} style="visibility: hidden" class="absolute bottom-0" on:load={setImageBrigthness} />
{/if}
