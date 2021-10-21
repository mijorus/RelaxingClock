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

        anime.timeline({
            autoplay: true,
            loop: true,
            endDelay: 5000,
            'targets': flob.querySelectorAll('svg'),
            direction: 'alternate',
        })
            .add({ 
                duration: 2000,
                easing: 'easeInOutQuad',
                rotate: `+=${anime.random(-10, 10)}`,
                scaleY: '+='+anime.random(0, 0.2),
                delay: anime.stagger(200, {start: anime.random(2000, 5000)}),
            })
            .add({
                 duration: 2000,
                easing: 'easeInOutQuad',
                rotate: `+=${anime.random(-10, 10)}`,
                scaleY: '+='+anime.random(0, 0.2),
                delay: anime.stagger(200, {start: anime.random(1000, 5000)}),
            })
    }

    function decorateWindow() {
        flobOne.append(...generateFlobDecoration((getFlob('random'))));
        flobOne.style.transform = `translateX(${randomBool() ? '' : '-'}${getRandomIntInclusive(40, 60)}%) translateY(-${getRandomIntInclusive(40, 60)}%)`;
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
