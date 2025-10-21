<script lang="ts">
    import { onMount, tick } from "svelte";

    import MainBg from "./components/elements/MainBg.svelte";
    import Rooster from "./components/rooster/Rooster.svelte";
    import Home from "./components/sections/Home.svelte";
    import Settings from "./components/sections/Settings.svelte";
    import { loggedWithSpotify, saveEnergy, weather } from "./stores/storedSettings";
    import NotificationsPanel from "./components/sections/notifications/NotificationsPanel.svelte";
    import { modalContent, onlineStatus } from "./stores/globalState";
    import { spotifyAccessToken, spotifyPlayerStatus, spotifyUserData } from "./stores/spotify";
    import { attemptSpotifyLogin } from "./handlers/spotify/login";
    import { SpotifyClient } from "./lib/spotify/SpotifyClient";
    import AlarmRing from "./components/elements/AlarmRing.svelte";
    import screenSaverHandler from "./handlers/screenSaver";
    import LoadingScreen from "./components/sections/LoadingScreen.svelte";
    import ColorSelector from "./components/elements/ColorSelector.svelte";
    import Modal from "./components/elements/Modal.svelte";
    import { windowReady } from "html-ready";
    import IntroTutorialModal from "./components/modals/IntroTutorialModal.svelte";
    import QuestionmarkModal from "./components/modals/QuestionmarkModal.svelte";
    import SurveyModal from "./components/modals/SurveyModal.svelte";
    import UpdateModal from "./components/modals/UpdateModal.svelte";
    import { createIncomingEvent } from "./components/clock/IncomingEventsMessages.svelte";
    import axios from "axios";

    let userInteraction = false;
    const isProd = process.env.production;
    screenSaverHandler.set(20 * 1000);
    // screenSaverHandler.set(1 * 1000);

    document.addEventListener("click", setInteraction);

    $: getUserData($spotifyAccessToken);

    function setInteraction(e) {
        userInteraction = true;
        document.removeEventListener("click", setInteraction);
        // console.log("User Interaction");
    }

    async function getUserData(accessToken: string) {
        if (accessToken) {
            const me = await SpotifyClient.getMe();
            spotifyUserData.set(me);

            if (me.product !== "premium") {
                spotifyPlayerStatus.set("non-premium");
            }
        }
    }

    function openQuestionmarkModal(e: KeyboardEvent) {
        if (document.activeElement === document.querySelector("body") && e.key === "?") {
            e.preventDefault();
            modalContent.set(QuestionmarkModal);
        }
    }

    onMount(async () => {
        console.log(process.env.VERSION);

        if (!localStorage.getItem("backup_saveEnergy")) {
            localStorage.setItem("backup_saveEnergy", JSON.stringify($saveEnergy));
        }

        // temporary set discontinued features
        weather.set(false);
        saveEnergy.set(true);

        document.querySelector("footer").classList.remove("hidden");
        document.querySelectorAll(".version-print").forEach((el) => (el.innerText = process.env.VERSION));

        // Var init
        localStorage.setItem("settingBoxCollapedStatus", JSON.stringify({}));

        // Spotify Login
        if ($onlineStatus) {
            attemptSpotifyLogin().catch((e) => console.error(e));
        }

        localStorage.setItem("hasSeenTutorial", "true");
        localStorage.setItem("askSurvey", "true");
        localStorage.setItem("version", process.env.VERSION);

        // if (!localStorage.getItem("hasSeenTutorial")) {
        //     // await tick();
        //     // modalContent.set(IntroTutorialModal);
        // } else if (!localStorage.getItem("askSurvey")) {
        //     // modalContent.set(SurveyModal);
        // } else if (localStorage.getItem("version") !== process.env.VERSION) {
        //     // } else {
        //     modalContent.set(UpdateModal);
        // }

        await windowReady;
        setTimeout(async () => {
            if (!userInteraction && localStorage.getItem("userHasLogged")) {
                spotifyPlayerStatus.set("waiting_interaction");
                createIncomingEvent({
                    icon: "fas fa-info",
                    text: "Tap anywhere to enable Spotify",
                });
            }
        }, 2500);
    });
</script>

<svelte:head>
    {#if userInteraction && localStorage.getItem("userHasLogged")}
        <script src="https://sdk.scdn.co/spotify-player.js" defer></script>
    {/if}
</svelte:head>

<LoadingScreen />
<Rooster />

{#await windowReady then _}
    <main class="w-screen overflow-hidden relative">
        <Home />
        <Settings />
        <NotificationsPanel />
        <MainBg />
    </main>
{/await}

<AlarmRing />
<ColorSelector />
<Modal />
<svelte:window on:keydown={openQuestionmarkModal} />

{#if isProd}
    <!-- Google tag (gtag.js) -->
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-MCHNKXNSFG"></script>
    <!-- <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4693990468679494" crossorigin="anonymous"></script> -->
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        gtag("js", new Date());

        gtag("config", "G-MCHNKXNSFG", { anonymize_ip: true });
    </script>
{/if}

<style global>
    @import "@csstools/normalize.css";
    @import "loaders.css/loaders.min.css";

    /* purgecss start ignore */
    @tailwind base;
    @tailwind components;
    /* purgecss end ignore */
    @tailwind utilities;

    @layer utilities {
        .transp-btn {
            cursor: pointer;
            border: none;
            background-color: transparent;
            outline: none;
        }

        .transp-btn:focus {
            border: none;
            background-color: transparent;
            outline: none;
        }

        .transp-btn:active {
            border: none;
            background-color: transparent;
            outline: none;
        }

        .shadow-box {
            box-shadow: 0px -15px 50px 0px var(--primary);
        }
    }
</style>
