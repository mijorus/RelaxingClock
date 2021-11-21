<script lang="ts">
    import NoSleep from 'nosleep.js';

    let isFullScreen: boolean = false;
    const noSleep: NoSleep = new NoSleep();

    async function openFullscreen() {
        await document.documentElement.requestFullscreen()
        noSleep.enable()
        isFullScreen = true;
    }

    async function closeFullscreen() {
        await document.exitFullscreen()
        noSleep.disable();
        isFullScreen = false;
    }

    function handleExpandIcon() {
        (document.fullscreenElement === null) 
            ? openFullscreen() 
            : closeFullscreen();
    }
</script>

<button class="top-0 right-0 m-1 absolute mx-2 transp-btn z-50" on:click|stopPropagation={handleExpandIcon}>
    <span class="lnr text-primary {isFullScreen ? "lnr-frame-contract text-2xl" : "lnr-frame-expand text-xl"}"></span>
</button>