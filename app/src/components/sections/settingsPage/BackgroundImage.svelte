<script lang="ts">
    import SettingsBox from "../../elements/SettingsBox.svelte";
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import { backgroundImage, backgroundImageSource, blink, saveEnergy } from "../../../stores/storedSettings";
    import { bgImageBright } from "../../../stores/globalState";
    import axios from "axios";
    import Action from "../../elements/settings/Buttons/Action.svelte";
    import Shuffle from "../../icons/Shuffle.svelte";
    import { onMount } from "svelte";

    let imageReference: HTMLImageElement;
    let loadingStatus: "error" | "loaded" | "loading" | "none" = "none";
    const bingRefreshKey = "bingWallpaperRefresh";
    const customClass = "bg-transparent border-2 border-white";

    // const demoImage = "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1MDc4NTl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTU3NjA0MzR8&ixlib=rb-4.0.3&q=85";
    const demoImage = "https://images.unsplash.com/photo-1694532228681-2f6d94c2f768?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=4752&q=80"

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
        loadingStatus = "loading";
        backgroundImageSource.set("bing");

        if (!process.env.production) {
            backgroundImage.set(demoImage);
            loadingStatus = "loaded";
            return;
        }

        try {
            const response = await axios.get("/.netlify/functions/bingDailyImage");
            backgroundImage.set(response.data.url);
            sessionStorage.setItem(bingRefreshKey, Date.now().toString());
        } catch (e) {
            console.error(e);
            loadingStatus = "error";
            backgroundImage.set('');
        }

        loadingStatus = "loaded";
    }

    async function setUnsplashImage() {
        loadingStatus = "loading";
        backgroundImageSource.set("unsplash");

        if (!process.env.production) {
            backgroundImage.set(demoImage);
            loadingStatus = "loaded";
            return;
        }

        try {
            const response = await axios.get("/.netlify/functions/unsplashImage");
            backgroundImage.set(response.data.urls.full);
        } catch (e) {
            console.error(e);
            loadingStatus = "error";
            backgroundImage.set('');
        }

        loadingStatus = "loaded";
    }

    function removeBgImage() {
        loadingStatus = "none";

        backgroundImage.set("");
        backgroundImageSource.set("default");
        bgImageBright.set("");
    }

    onMount(() => {
        if ($backgroundImage.length) {
            loadingStatus = "loaded";
        }

        if ($backgroundImageSource === "bing" && sessionStorage.getItem(bingRefreshKey) === undefined) {
            setBingImage();
        }
    });
</script>

<SettingsBox bordered={false} id="background-image">
    <Title title="Background">
        <TitleIcon>
            <i class="lnr lnr-picture text-purple-500 settings-title-icon" />
        </TitleIcon>
    </Title>
    <PrimaryBox
        label={{ text: "Select a style" }}
        description={{
            text: "Customize the background of the clock with images: use Bing to get a new wallpaper every day, while Unsplash provides a full catalog of images to choose from with the Randomize button",
            iconClass: "lnr lnr-question-circle",
        }}
        available={true}
    >
        <div class="flex flex-row items-center gap-2">
            {#if loadingStatus === "error"}
                <span class="inline-block text-red-500 mr-6 rounded-full">
                    <i class="fas fa-exclamation-circle" />
                </span>
            {:else if loadingStatus === "loading"}
                <span class="inline-block text-white animate-spin">
                    <i class="fas fa-sync-alt" />
                </span>
            {:else if loadingStatus === "loaded" && $backgroundImageSource === "unsplash"}
                <span class="inline-block text-white">
                    <Shuffle color="#fff" />
                </span>
            {/if}

            <Action on:click={() => removeBgImage()} custom={$backgroundImageSource !== "default"} customClass={$backgroundImageSource !== "default" ? customClass : ""} label="Default" />
            <Action on:click={() => setBingImage()} custom={$backgroundImageSource !== "bing"} customClass={$backgroundImageSource !== "bing" ? customClass : ""} label="Bing" />
            <Action on:click={() => setUnsplashImage()} custom={$backgroundImageSource !== "unsplash"} customClass={$backgroundImageSource !== "unsplash" ? customClass : ""} label="Unsplash" />
        </div>
    </PrimaryBox>
</SettingsBox>

<!-- svelte-ignore a11y-missing-attribute -->
{#if $backgroundImage?.length}
    <img bind:this={imageReference} src={$backgroundImage} style="visibility: hidden" class="absolute bottom-0" on:load={setImageBrigthness} />
{/if}
