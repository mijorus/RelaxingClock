import anime, { AnimeInstance, AnimeTimelineInstance } from 'animejs';
import randomColor from 'randomcolor';

let tl: AnimeTimelineInstance;
let target: HTMLElement;
let shakeClock: AnimeInstance;
const ringTimeout = 60;

export function ring() {
    target = document.querySelector('#alarm-ring');
    const tlParams = { duration: 350, easing: 'linear', autoplay: false, loop: false };
    const colors = randomColor({ count: 2, luminosity: 'light', format: 'rgba', alpha: 0.9 });
    tl = anime.timeline(tlParams); const tll = anime.timeline(tlParams);

    shakeClock = anime({ targets: '#alarm-clock-ring', duration: 85, easing: 'linear', direction: 'alternate', rotate: [30, -30], loop: true })

    tl.add({
        update(percent) { target.style.background = `radial-gradient(circle, ${colors[0]} ${(percent.progress) / 2}%, ${colors[1]} ${(percent.progress) * 2}%)` },
        complete() { tll.restart() }
    }, 0);

    tll.add({
        update(percent) { target.style.background = `radial-gradient(circle, ${colors[1]}  ${(percent.progress)}%, ${colors[0]} ${(percent.progress) * 2}%)` },
        complete() { setTimeout(() => tl.restart(), 250); }
    }, 0);

    tl.restart();
    setTimeout(() => dismiss(), ringTimeout * 1000);
}

export function dismiss() {
    if (tl) tl.pause();
    if (target) target.classList.add('d-none');
}