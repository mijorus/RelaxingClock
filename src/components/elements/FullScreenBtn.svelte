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

<div class="top-0 right-0 m-1 absolute" on:click={handleExpandIcon}>
    <span class="lnr text-primary text-sm {isFullScreen ? "lnr-frame-contract" : "lnr-frame-expand"}"></span>
</div>