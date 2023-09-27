<script lang="ts">
    import SettingsBox from "../../elements/SettingsBox.svelte";
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import { backgroundImage, backgroundImageSource, blink, saveEnergy } from "../../../stores/storedSettings";
    import { bgImageBright, mobileStatus } from "../../../stores/globalState";
    import axios from "axios";
    import Action from "../../elements/settings/Buttons/Action.svelte";
    import Shuffle from "../../icons/Shuffle.svelte";
    import { onMount } from "svelte";
    import { shortcuts } from "../../../stores/rooster";
    import { set_data_dev } from "svelte/internal";
    import { fade } from "svelte/transition";

    let imageReference: HTMLImageElement;
    let loadingStatus: "error" | "loaded" | "loading" | "none" = "none";
    const bingRefreshKey = "bingWallpaperRefresh";
    const customClass = "bg-transparent border-2 border-transparent";

    // const demoImage = "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1MDc4NTl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTU3NjA0MzR8&ixlib=rb-4.0.3&q=85";
    const demoImage = "https://images.unsplash.com/photo-1694532228681-2f6d94c2f768?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=4752&q=80";

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
            backgroundImage.set("");
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
            backgroundImage.set("");
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

        console.log("SETTI");

        shortcuts.set("background", {
            color: "white",
            background: "purple",
            arguments: {
                default: {
                    description: "Set the default backgroud",
                    async callback(p) {
                        removeBgImage();
                        return true;
                    },
                },
                unsplash: {
                    description: "Set the default backgroud",
                    async callback(p) {
                        if (!p.length) {
                            setUnsplashImage();
                            return true;
                        }
                    },
                },
                bing: {
                    description: "Set the default backgroud",
                    async callback(p) {
                        await setBingImage();
                        return true;
                    },
                },
            },
            async examples(arg, p) {
                const unsplashEmptyExample = { argument: "unsplash <query>", example: "", tip: "Search an image on Unsplash" };

                if (arg === "unsplash") {
                    if (!p.trim().length) {
                        return {
                            namespace: "Search on Unsplash",
                            group: [unsplashEmptyExample],
                        };
                    }

                    return {
                        namespace: "Search on Unsplash",
                        group: [
                            { example: "Prova", tip: "Nome autore" },
                            { example: "Prova", tip: "Nome autore" },
                            { example: "Prova", tip: "Nome autore" },
                            { example: "Prova", tip: "Nome autore" },
                        ],
                    };
                }

                return {
                    namespace: "Usage",
                    group: [
                        unsplashEmptyExample,
                        { argument: "unsplash", example: "", tip: "Set a random photo from Unsplash as background" },
                        { argument: "bing", example: "", tip: "Set or update the Bing daily image as backgorund" },
                        { argument: "default", example: "", tip: "Reset the default empty background" },
                    ],
                };
            },
        });
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
        hideLabelOnMobile={true}
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
                <span class="inline-block text-white cursor-pointer pointer" on:click={() => setUnsplashImage()} in:fade>
                    <Shuffle color="#fff" />
                </span>
                <span>&middot</span>
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
