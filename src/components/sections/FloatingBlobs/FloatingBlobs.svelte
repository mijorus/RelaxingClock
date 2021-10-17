<script lang="ts">
import anime from "animejs";
import { windowReady } from "html-ready";
import { onMount } from "svelte";
import { getRandomIntInclusive, randomBool } from "../../../utils/utils";
import { getFlob } from "./flobs";

    const flobStokeColor = process.env.TEXT_SECONDARY;
    let flobOne: HTMLElement;

    function generateFlobDecoration(flob: SVGElement) {
        flob.setAttribute('stroke', flobStokeColor);
        
        let flobs = [flob];
        for (let i = 0; i < 4; i++) {
            //@ts-ignore
            const newFlob: SVGElement = flob.cloneNode(true);
            newFlob.querySelector('path').setAttribute('transform', `translate(100, 100) scale(${(0.9 - (i / 10))}) rotate(${getRandomIntInclusive(0, 3)})`);
            newFlob.querySelector('path').setAttribute('stroke', `grey`);
            newFlob.classList.add('absolute', 'top-0', 'w-100');
            flobs.push(newFlob);
        }

        console.log(flobs);
        return flobs;
    }

    function animateFlob(flob: HTMLElement) {
        anime({
            'targets': flob.getElementsByTagName('path'),
            easing: 'linear',
            'stroke': ['#8e8e8e','#3d3d3d'],
            delay: anime.stagger(300),
            duration: 800,
        })

        anime({
            'targets': flob.querySelectorAll('svg'),
            easing: 'easeInOutQuad',
            direction: 'alternate',
            endDelay: 5000,
            rotate: `+=${anime.random(5, 5.5)}`,
            translateY: '+='+anime.random(5, 5.5),
            translateX: '+='+anime.random(5, 5.5),
            scaleY: '+='+anime.random(0, 0.5),
            loop: true,
            duration: 2000,
            delay: anime.stagger(100, {start: anime.random(1000, 5000)}),
        })
    }

    function decorateWindow() {
        flobOne.append(...generateFlobDecoration((getFlob('random'))));
        flobOne.style.transform = `translate(${randomBool() ? '' : '-'}${getRandomIntInclusive(40, 60)}%, -${getRandomIntInclusive(40, 60)}%)`;
        animateFlob(flobOne);
    }


    onMount(async() => {
        await windowReady;
        decorateWindow()
    })
</script>


<div id="flobOne" bind:this={flobOne} class="w-screen">
    <!-- <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-screen absolute top-0"></svg> -->
</div>
