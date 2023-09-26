<script lang="ts">
    import SettingsBox from "../../elements/SettingsBox.svelte";
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import Booleans from "../../elements/settings/Buttons/Booleans.svelte";
    import { backgroundImage, backgroundImageSource, blink, saveEnergy } from "../../../stores/storedSettings";
    import { bgImageBright } from "../../../stores/globalState";
    import axios from "axios";
    import Action from "../../elements/settings/Buttons/Action.svelte";

    let imageReference: HTMLImageElement;
    let loadingError = false;
    const customClass = "bg-transparent border-2 border-white";

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

    async function setBingImage() {
        loadingError = false;

        try {
            const response = await axios.get("/.netlify/functions/bingDailyImage");
            backgroundImage.set(response.data.url);
            backgroundImageSource.set("bing");
        } catch (e) {
            console.error(e);
            loadingError = true;
        }
    }

    async function setUnsplashImage() {
        loadingError = false;

        try {
            const response = await axios.get("/.netlify/functions/unsplashImage");

            backgroundImage.set(response.data.urls.full);
            backgroundImageSource.set("unsplash");
        } catch (e) {
            console.error(e);
            loadingError = true;
        }
    }

    function removeBgImage() {
        loadingError = false;

        backgroundImage.set("");
        backgroundImageSource.set("default");
    }
</script>

<SettingsBox bordered={false} id="background-image">
    <Title title="Background">
        <TitleIcon>
            <i class="lnr lnr-leaf text-green-500 settings-title-icon" />
        </TitleIcon>
    </Title>
    <PrimaryBox
        label={{ text: "Select a style" }}
        description={{
            text: "Reduce motion and animations when the window in not in focus. Can help if your laptop is running on battery or you want to reduce the impact on your GPU",
            iconClass: "lnr lnr-question-circle",
        }}
        available={true}
    >
        {#if loadingError}
            <span class="inline-block text-red-500 mr-6 rounded-full">
                <i class="fas fa-exclamation-circle" />
            </span>
        {/if}
        <Action on:click={() => removeBgImage()} custom={$backgroundImageSource !== "default"} customClass={$backgroundImageSource !== "default" ? customClass : ""} label="Default" />
        <Action on:click={() => setBingImage()} custom={$backgroundImageSource !== "bing"} customClass={$backgroundImageSource !== "bing" ? customClass : ""} label="Bing" />
        <Action on:click={() => setUnsplashImage()} custom={$backgroundImageSource !== "unsplash"} customClass={$backgroundImageSource !== "unsplash" ? customClass : ""} label="Unsplash" />
    </PrimaryBox>
</SettingsBox>

<!-- svelte-ignore a11y-missing-attribute -->
{#if $backgroundImage?.length}
    <img bind:this={imageReference} src={$backgroundImage} style="visibility: hidden" class="absolute bottom-0" on:load={setImageBrigthness} />
{/if}
