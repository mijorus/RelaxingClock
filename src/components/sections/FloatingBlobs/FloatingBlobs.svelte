<script lang="ts">
import { windowReady } from "html-ready";

import { onMount } from "svelte";
import { getFlob } from "./flobs";

    let viewBox: SVGSVGElement;

    function decorateWindow() {
        console.log(getFlob(0));
        
        viewBox.appendChild((getFlob(0)));
    }


    onMount(async() => {
        await windowReady;
        decorateWindow()
    })
</script>


<svg id="ciao" bind:this={viewBox} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width: 1800px;"></svg>

