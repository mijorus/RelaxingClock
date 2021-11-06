<script lang="ts">
import anime from "animejs";
import { windowReady } from "html-ready";
import { onMount } from "svelte";
import { windowFocus } from "../../../stores/globalState";
import { saveEnergy } from "../../../stores/storedSettings";
import { eaElasticDefault } from "../../../utils/animations";
import { getRandomIntInclusive, randomBool } from "../../../utils/utils";
import { getFlob } from "./flobs";

    const flobStokeColor = process.env.TEXT_SECONDARY;
    let flobOne: HTMLElement;
    let flobTwo: HTMLElement;
    let flobThree: HTMLElement;
    let tls: anime.AnimeTimelineInstance[] = [];

    $: {
        if ($saveEnergy && tls.length) {
            tls.forEach(t => {
                t.play();
                console.log('background animation resumed');
            });
        }
    }

    function generateFlobDecoration(flob: SVGElement) {
        flob.setAttribute('stroke', flobStokeColor);
        
        let flobs = [flob];
        for (let i = 0; i < 4; i++) {
            //@ts-ignore
            const newFlob: SVGElement = flob.cloneNode(true);
            newFlob.querySelector('path').setAttribute('transform', `translate(100, 100) scale(${(0.9 - (i / 10))}) rotate(${getRandomIntInclusive(0, 3)})`);
            newFlob.classList.add('absolute', 'top-0', 'w-100');
            flobs.push(newFlob);
        }

        flobs.forEach(f => f.querySelector('path').setAttribute('stroke', `#3d3d3d`));
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
                duration: 4000,
                easing: eaElasticDefault,
                rotate: `+=${anime.random(-10, 10)}`,
                scale: '+='+ (anime.random(5, 30) / 100),
                delay: anime.stagger(200, {start: anime.random(2000, 5000)}),
            })
            .add({
                duration: 4000,
                easing: eaElasticDefault,
                rotate: `+=${anime.random(-10, 10)}`,
                scale: '1',
                delay: anime.stagger(200, {start: anime.random(1000, 5000)}),
            })
            .add({
                duration: 10000,
                easing: eaElasticDefault,
                rotate: `+=${anime.random(-30, 30)}`,
                delay: anime.stagger(300, {start: anime.random(1000, 5000)}),
            })
        
        tls.push(tl);
    }

    function decorateWindow() {
        const randomPos = randomBool();
        flobOne.append(...generateFlobDecoration((getFlob('random'))));
        flobOne.style.transform = `translateX(${randomPos ? '' : '-'}${getRandomIntInclusive(40, 60)}%) translateY(-${getRandomIntInclusive(40, 60)}%)`;
        animateFlob(flobOne);

        flobTwo.append(...generateFlobDecoration((getFlob('random'))));
        flobTwo.style.transform = `translateX(${!randomPos ? '' : '-'}${getRandomIntInclusive(40, 60)}%) translateY(-${getRandomIntInclusive(40, 60) + 100}%)`;
        animateFlob(flobTwo);

        flobThree.append(...generateFlobDecoration((getFlob('random'))));
        flobThree.style.transform = `translateX(${randomPos ? '' : '-'}${getRandomIntInclusive(40, 60)}%) translateY(0%)`;
    }


    onMount(async() => {
        await windowReady;
        decorateWindow()
    })
</script>


<div id="flobOne" bind:this={flobOne} class="w-screen">
    <!-- <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-screen absolute top-0"></svg> -->
</div>
<div id="flobTwo" bind:this={flobTwo} class="h-screen">
    <!-- <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-screen absolute top-0"></svg> -->
</div>
<div id="flobThree" bind:this={flobThree} class="h-screen">
    <!-- <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-screen absolute top-0"></svg> -->
</div>
