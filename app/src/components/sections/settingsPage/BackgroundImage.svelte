<script lang="ts">
    import SettingsBox from "../../elements/SettingsBox.svelte";
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import { backgroundImage, backgroundImageSource, blink, saveEnergy } from "../../../stores/storedSettings";
    import { bgImageBright, mobileStatus, screenSaver, tips } from "../../../stores/globalState";
    import axios, { AxiosResponse } from "axios";
    import Action from "../../elements/settings/Buttons/Action.svelte";
    import { onMount } from "svelte";
    import { shortcuts } from "../../../stores/rooster";
    import Pin from "../../icons/Pin.svelte";
    import { userInfo } from "os";
    import { fade } from "svelte/transition";

    interface UnsplashSearchResult {
        urls: { [key: string]: string };
        user: { username: string; name: string };
        location: string;
        description: string;
        created_at: string;
    }

    let imageReference: HTMLImageElement;
    let loadingStatus: "error" | "loaded" | "loading" | "none" = "none";
    const bingRefreshKey = "bingWallpaperRefresh";
    const customClass = "bg-transparent border-2 border-transparent";
    let unsplashSearchDebouncer;

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
            // bgImageBright.set('dark')
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
            const response: AxiosResponse<UnsplashSearchResult> = await axios.get("/.netlify/functions/unsplashImage");
            backgroundImage.set(response.data.urls.full);
        } catch (e) {
            console.error(e);
            loadingStatus = "error";
            backgroundImage.set("");
        }

        loadingStatus = "loaded";
    }
    
    function openUnsplashSearch() {
        window.dispatchEvent(new CustomEvent("injectRoosterAction", { detail: { command: "background", argument: 'unsplash' } }));
    }

    // function setSonoma() {
    //     backgroundImageSource.set("sonoma");
    //     bgImageBright.set("light");
    //     backgroundImage.set("video:" + "/media/forest_short.mp4");
    //     screenSaverHandler.enable();
    // }

    function removeBgImage() {
        loadingStatus = "none";

        backgroundImage.set("none");
        backgroundImageSource.set("default");
        bgImageBright.set("none");
    }

    onMount(() => {
        if ($backgroundImage.length) {
            loadingStatus = "loaded";
        }

        if ($backgroundImageSource === "bing" && sessionStorage.getItem(bingRefreshKey) === undefined) {
            setBingImage();
        }

        if ($backgroundImageSource === "sonoma") {
            bgImageBright.set("light");
        }

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
                    async callback(p, selectedItem) {
                        if (!p.length) {
                            setUnsplashImage();
                            return true;
                        }

                        if (selectedItem) {
                            backgroundImage.set(selectedItem);
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

                    if (!process.env.production) {
                        return {
                            namespace: "Search on Unsplash",
                            group: [
                                { example: "Prova", tip: "Nome autore", image: demoImage, selectable: true, id: demoImage },
                                { example: "Prova", tip: "Nome autore", image: demoImage, selectable: true, id: demoImage },
                                { example: "Prova", tip: "Nome autore", image: demoImage, selectable: true, id: demoImage },
                                { example: "Prova", tip: "Nome autore", image: demoImage, selectable: true, id: demoImage },
                            ],
                        };
                    }

                    return new Promise((resolve) => {
                        clearTimeout(unsplashSearchDebouncer);
                        unsplashSearchDebouncer = setTimeout(async () => {
                            const response: AxiosResponse<UnsplashSearchResult[]> = await axios.get("/.netlify/functions/unsplashImage", { params: { q: p } });
                            resolve({
                                namespace: "Search on Unsplash",
                                group: response.data.map((el) => {
                                    return { example: el.user.name, tip: new Date(el.created_at).toDateString(), image: el.urls.small, selectable: true, id: el.urls.full };
                                }),
                            });
                        }, 500);
                    });
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
        label={{ text: "Pick a style" }}
        hideLabelOnMobile={true}
        description={{
            text: "Customize the background of the clock with images:<br>- Bing gets a new wallpaper every day<br>- Unsplash provides a full catalog of images to choose from",
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
            {:else if loadingStatus === "loaded"}
                {#if $backgroundImageSource === "unsplash"}
                    <span class="inline-block text-white cursor-pointer pointer" on:click={() => openUnsplashSearch()} in:fade>
                        <span class="lnr lnr-magnifier" />
                    </span>
                    <span>&middot</span>
                {/if}
            {/if}

            <Action on:click={() => removeBgImage()} custom={$backgroundImageSource !== "default"} customClass={$backgroundImageSource !== "default" ? customClass : ""} label="Default" />
            <Action on:click={() => setBingImage()} custom={$backgroundImageSource !== "bing"} customClass={$backgroundImageSource !== "bing" ? customClass : ""} label="Bing" />
            <Action on:click={() => setUnsplashImage()} custom={$backgroundImageSource !== "unsplash"} customClass={$backgroundImageSource !== "unsplash" ? customClass : ""} label="Unsplash" />
            <!-- <Action on:click={() => setSonoma()} custom={$backgroundImageSource !== "sonoma"} customClass={$backgroundImageSource !== "sonoma" ? customClass : ""} label="Sonoma" /> -->
        </div>
    </PrimaryBox>
</SettingsBox>

<!-- svelte-ignore a11y-missing-attribute -->
{#if !$backgroundImage.startsWith("video:")}
    <img bind:this={imageReference} src={$backgroundImage} style="visibility: hidden" class="absolute bottom-0" on:load={setImageBrigthness} />
{/if}
