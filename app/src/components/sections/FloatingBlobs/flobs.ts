import anime from "animejs";
import { get } from "svelte/store";
import { accentColor, saveEnergy } from "../../../stores/storedSettings";
import { eaElasticDefault } from "../../../utils/animations";
import { getRandomIntInclusive } from "../../../utils/utils";

let isPulsing = false;
export function pulse(loop = 4) {
    if (isPulsing) return;
    
    anime({
        begin() { isPulsing = true },
        targets: [
            document.getElementById('flob1').getElementsByTagName('path'),
            document.getElementById('flob2').getElementsByTagName('path')
        ],
        easing: 'linear',
        stroke: ['#3d3d3d', '#8e8e8e', '#3d3d3d'],
        delay: anime.stagger(100, {start: 1500}),
        direction: 'reverse',
        duration: 800,
        loop,
        complete() { isPulsing = false }
    })
}

export const flobs: string[] = [
`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path fill="#FF0066" d="M43.5,-66.2C58,-58.3,72.5,-49,72.2,-36.8C71.9,-24.5,56.7,-9.3,51.6,5.5C46.6,20.3,51.6,34.7,46,38.1C40.3,41.4,24,33.8,12.9,31.3C1.8,28.9,-4.1,31.6,-17,37.3C-29.9,43,-49.8,51.7,-59,47.5C-68.2,43.4,-66.8,26.4,-64.5,12.1C-62.2,-2.2,-59.1,-13.9,-51.9,-21.3C-44.7,-28.7,-33.6,-31.8,-24.3,-42C-15,-52.2,-7.5,-69.4,3.5,-74.8C14.5,-80.3,29,-74,43.5,-66.2Z" transform="translate(100 100)" />
</svg>`, 
`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path fill="transparent" d="M34.3,-63.2C40.7,-55.8,39.4,-38.9,40.9,-26.8C42.4,-14.6,46.8,-7.3,53.4,3.8C60,15,68.9,30,66,39.6C63,49.2,48.2,53.5,35.2,53.1C22.2,52.6,11.1,47.5,-1.4,50C-13.9,52.4,-27.8,62.4,-39.1,61.8C-50.4,61.3,-59.1,50.2,-63,38.1C-66.9,26.1,-66.2,13,-67.2,-0.6C-68.1,-14.2,-70.9,-28.3,-67.2,-40.9C-63.6,-53.5,-53.6,-64.5,-41.3,-68.5C-29.1,-72.4,-14.5,-69.3,-0.3,-68.8C14,-68.3,28,-70.5,34.3,-63.2Z" transform="translate(100 100)" />
</svg>`, 
`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path fill="#FF0066" d="M15,-29.3C19,-20.7,21.5,-15.8,26,-10.6C30.5,-5.3,37,0.5,38.8,7.4C40.7,14.3,37.9,22.4,32.7,28.3C27.5,34.3,19.9,38,12.2,39.4C4.4,40.7,-3.5,39.7,-15.6,41.5C-27.8,43.3,-44.3,48,-54.8,43.3C-65.3,38.7,-69.9,24.7,-63.6,14.2C-57.2,3.7,-40,-3.4,-31.1,-10.6C-22.2,-17.8,-21.5,-25.1,-17.7,-33.9C-13.9,-42.6,-7,-52.6,-0.7,-51.5C5.5,-50.3,10.9,-37.9,15,-29.3Z" transform="translate(100 100)" />
</svg>`,
`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path fill="#FF0066" d="M40.1,-58.3C51.5,-55.1,59.7,-43.1,58.9,-31C58.1,-18.9,48.1,-6.7,48.3,8.5C48.6,23.8,59.1,42,54.9,48.4C50.7,54.7,31.7,49.1,16.8,50.4C1.8,51.8,-9.1,60.1,-19.2,59.7C-29.2,59.4,-38.4,50.3,-43,40C-47.5,29.7,-47.4,18.3,-52.5,5.5C-57.5,-7.3,-67.6,-21.4,-65.8,-32C-63.9,-42.5,-50.1,-49.5,-37.2,-51.9C-24.2,-54.3,-12.1,-52.1,1.1,-53.9C14.4,-55.6,28.8,-61.4,40.1,-58.3Z" transform="translate(100 100)" />
</svg>`,
`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path fill="#FF0066" d="M47,-75C58.1,-66,62.4,-48.2,69.3,-32C76.1,-15.8,85.6,-1,78.2,7.2C70.8,15.5,46.5,17.4,33,23.2C19.6,28.9,16.9,38.5,11.7,40.3C6.5,42,-1.1,35.8,-7.2,31.1C-13.3,26.3,-17.9,22.9,-27.6,19.5C-37.4,16.2,-52.2,12.9,-53.8,7.3C-55.3,1.6,-43.6,-6.5,-38.5,-17.6C-33.4,-28.6,-35,-42.8,-29.7,-54.4C-24.4,-66,-12.2,-75.1,2.9,-79.6C18,-84.1,35.9,-83.9,47,-75Z" transform="translate(100 100)" />
</svg>`,
`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path fill="#FF0066" d="M40.5,-66.9C50.9,-56.3,56.7,-42.4,56.1,-29.7C55.5,-17,48.5,-5.5,49.3,9C50.2,23.5,58.9,41.1,53.7,45.8C48.5,50.6,29.3,42.6,16.7,37.5C4,32.4,-2.1,30.2,-13.4,32.7C-24.7,35.3,-41.1,42.6,-47.7,39.1C-54.4,35.5,-51.2,21.2,-53.1,7.7C-55,-5.9,-62,-18.7,-58.8,-27.3C-55.6,-35.9,-42.1,-40.3,-30.6,-50.4C-19.2,-60.4,-9.6,-76.1,2.7,-80.4C15,-84.7,30.1,-77.4,40.5,-66.9Z" transform="translate(100 100)" />
</svg>`
];

export function getFlob(index: number | 'random'): SVGElement {
    if (index === 'random') index = getRandomIntInclusive(0, (flobs.length - 1));
    if (index < flobs.length) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(flobs[index], 'text/html');
        const element = (doc.body.getElementsByTagName('svg')[0]);
        const path = element.querySelector('path');

        path.setAttribute('fill', 'transparent');
        path.setAttribute('stroke-width', '.3');
        path.setAttribute('stroke', 'white');
        return element;
    }

    return null;
}