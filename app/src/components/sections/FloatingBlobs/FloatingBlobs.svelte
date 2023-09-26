<script lang="ts">
import anime from "animejs";
import { windowReady } from "html-ready";
import { onMount } from "svelte";
import { screenSize, windowFocus } from "../../../stores/globalState";
import { accentColor, saveEnergy } from "../../../stores/storedSettings";
import { eaElasticDefault } from "../../../utils/animations";
import { getRandomIntInclusive, randomBool } from "../../../utils/utils";
import { getFlob, pulse } from "./flobs";

    const flobStokeColor = process.env.TEXT_SECONDARY;
    let flobOne: HTMLElement;
    let flobTwo: HTMLElement;
    let flobThree: HTMLElement;
    let tls: anime.AnimeTimelineInstance[] = [];
    let lastDescorationSize = null;

    $: {
        if ($screenSize && flobThree) {
            decorateWindow($screenSize);
        }
    }

    function generateFlobDecoration(flob: SVGElement) {
        flob.setAttribute('stroke', flobStokeColor);
        
        let flobs = [flob];
        for (let i = 0; i < 4; i++) {
            //@ts-ignore
            const newFlob: SVGElement = flob.cloneNode(true);
            newFlob.querySelector('path').setAttribute('transform', `translate(100, 100) scale(${(0.9 - (i / 10))}) rotate(${getRandomIntInclusive(1, 4)})`);
            newFlob.classList.add('absolute', 'top-0', 'w-100', 'transform-gpu');
            flobs.push(newFlob);
        }

        flobs.forEach(f => f.querySelector('path').setAttribute('stroke', `#3d3d3d`));
        return flobs;
    }

    function animateFlob(flob: HTMLElement) {
        const tl = anime.timeline({
            begin(a) {
                if ($saveEnergy) a.pause();
            },
            'targets': flob.querySelectorAll('svg'),
            autoplay: true,
            loop: true,
            loopComplete(a) {
                if ($saveEnergy) {
                    a.pause();
                    console.log('animation was paused');
                }
            },
            delay: anime.random(5000, 25000),
            endDelay: 5000,
            direction: 'alternate',
        })
            .add({ 
                duration: 40000,
                easing: eaElasticDefault,
                rotate: `+=${anime.random(-15, 15)}`,
                scale: '+='+ (anime.random(5, 45) / 100),
                delay: anime.stagger(200, {start: anime.random(2000, 5000)}),
            })
            .add({
                duration: 40000,
                easing: eaElasticDefault,
                rotate: `+=${anime.random(-10, 10)}`,
                scale: '1',
                delay: anime.stagger(200, {start: anime.random(1000, 5000)}),
            })
            .add({
                duration: 50000,
                easing: eaElasticDefault,
                rotate: `+=${anime.random(-30, 30)}`,
                delay: anime.stagger(300, {start: anime.random(1000, 5000)}),
            })
        
        tls.push(tl);
    }

    function decorateWindow(screenSize) {
        if (lastDescorationSize && ( ((screenSize < 768) && (lastDescorationSize < 768)) || ((screenSize > 768) && (lastDescorationSize > 768)) ) ) {
            return;
        }

        lastDescorationSize = screenSize;

        ['1', '2', '3'].forEach(el => {
            if (document.querySelector(`#flob${el}`)) document.querySelector(`#flob${el}`).innerHTML = null
        });

        const randomPos = randomBool();
        flobOne.append(...generateFlobDecoration((getFlob('random'))));
        flobOne.style.transform = (screenSize > 768) 
            ? `translateX(${randomPos ? '' : '-'}${getRandomIntInclusive(40, 60)}%) translateY(-${getRandomIntInclusive(40, 60)}%) scale(1)`
            : `translateX(${randomPos ? '' : '-'}${getRandomIntInclusive(40, 60)}%) translateY(-${getRandomIntInclusive(10, 30)}%) scale(1.5)`;
        animateFlob(flobOne);

        flobTwo.append(...generateFlobDecoration((getFlob('random'))));
        flobTwo.style.transform = (screenSize > 768)
            ? `translateX(${!randomPos ? '' : '-'}${getRandomIntInclusive(40, 60)}%) translateY(-${getRandomIntInclusive(70, 90) + 100}%) scale(1)`
            : `translateX(${!randomPos ? '' : '-'}${getRandomIntInclusive(40, 60)}%) translateY(-${getRandomIntInclusive(0, 20)}%) scale(1.5)`;
        animateFlob(flobTwo);

        pulse();

        if (!flobThree) {
            flobThree = document.createElement('div');
            flobThree.setAttribute('id', 'flob3');
            flobThree.classList.add('h-screen', 'w-screen', 'absolute');
            flobThree.style.zIndex = '-50';
        }

        flobThree.append(...generateFlobDecoration((getFlob('random'))));
        flobThree.style.transform = `translateX(${randomPos ? '' : '-'}${getRandomIntInclusive(40, 60)}%) translateY(-100%)`;

        document.querySelector('#app').append(flobThree);
    }


    onMount(async() => {
        await windowReady;
        decorateWindow($screenSize);
    })
</script>


<div id="flob1" bind:this={flobOne} class="flob w-screen">
    <!-- <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-screen absolute top-0"></svg> -->
</div>
<div id="flob2" bind:this={flobTwo} class="flob h-screen">
    <!-- <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-screen absolute top-0"></svg> -->
</div>