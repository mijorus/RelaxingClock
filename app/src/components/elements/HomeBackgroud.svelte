<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import Pin from "../icons/Pin.svelte";
    import anime from "animejs";
    import PinBubble from "../sections/pinned/PinBubble.svelte";
    import { screenSaver } from "../../stores/globalState";

    export let cssClasses = "";

    let bgVideo: HTMLVideoElement;
    let videoMonitorInterval: NodeJS.Timeout = null;
    const slowDownVideoAfter = 20;

    let slowingDown = false;

    // $: if (videoMonitorInterval === null && bgVideo) enableVideoListener();

    $: handleScreenSaver($screenSaver);

    function handleScreenSaver(active: boolean) {
        if (!bgVideo) return;
        
        if (active) {
            bgVideo.playbackRate = 8;
            bgVideo.play();
        } else {
            if (!bgVideo.paused) {
                slowDownVideo(2);
            }
        }
    }

    function slowDownVideo(duration) {
        if (slowingDown) return;

        console.log("Slowing down video background");

        slowingDown = true;

        anime({
            //duration: duration * 1000,
            duration: 2000,
            easing: "linear",
            update: (anim) => {
                // let newVideoSpeed = parseFloat((1 - anim.progress / 100).toFixed(1));
                // console.log(newVideoSpeed);
                // bgVideo.playbackRate = newVideoSpeed;
                // console.log(videoFrame.toSMPTE());
                // videoFrame.seekForward()
                // console.log(anim.progrkess);

                const progress = 100 - anim.progress;
                if (progress === 0) {
                    bgVideo.pause();
                    clearInterval(videoMonitorInterval);
                } else if (progress < 5) {
                    bgVideo.playbackRate = 1.5;
                } else if (progress < 15 && progress > 5) {
                    bgVideo.playbackRate = 1.5;
                } else if (progress > 15 && progress < 50) {
                    bgVideo.playbackRate = 3;
                } else if (progress < 75) {
                    bgVideo.playbackRate = 4;
                } else {
                    bgVideo.playbackRate = 6;
                }
            },
        });

        // setInterval(() => {
        //     videoFrame.seekForward()
        // }, 33)
    }

    function videoTimeUpdate() {
        const timeRemaning = bgVideo.duration - bgVideo.currentTime;
        // console.log(timeRemaning, ((timeRemaning <= slowDownVideoAtSeconds) ));
        if (bgVideo.currentTime > slowDownVideoAfter && !slowingDown) {
            slowDownVideo(timeRemaning);
        }
    }

    function enableVideoListener() {
        bgVideo.play();
        bgVideo.playbackRate = 8;
        bgVideo.addEventListener("playing", () => {
            clearInterval(videoMonitorInterval);
            videoMonitorInterval = setInterval(videoTimeUpdate, 250);
        });

        bgVideo.addEventListener("ended", () => {
            clearInterval(videoMonitorInterval);
        });
    }

    onDestroy(() => {
        clearInterval(videoMonitorInterval);
    });
</script>

<video id="background-vide" bind:this={bgVideo} src="/media/test.mov" class="{cssClasses} object-cover" controls={false} />
