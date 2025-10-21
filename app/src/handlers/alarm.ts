import anime, { AnimeInstance, AnimeTimelineInstance } from 'animejs';
import randomColor from 'randomcolor';
import { tick } from 'svelte';
import { alarmIsRinging, timerIsRinging } from '../stores/globalState';
import { notifications } from '../stores/notifications';
import { canBeSummoned } from '../stores/rooster';
import { alarmTime, timerTime } from '../stores/storedSettings';

let tl: AnimeTimelineInstance;
let target: HTMLElement;
let shakeClock: AnimeInstance;
let ringTimeout: NodeJS.Timeout;

type AlarmType = 'alarm' | 'timer';

export async function ring(type: AlarmType = 'alarm') {
    if (type === 'alarm') {
        alarmIsRinging.set(true);
    }

    if (type === 'timer') {
        timerIsRinging.set(true);
    }

    canBeSummoned.set(false);
    await tick();

    target = document.querySelector('#alarm-ring');
    const tlParams = { duration: 350, easing: 'linear', autoplay: false, loop: false };
    const colors = randomColor({ count: 2, luminosity: 'light', format: 'rgba', alpha: 0.9, hue: 'random' });
    tl = anime.timeline(tlParams); const tll = anime.timeline(tlParams);

    shakeClock = anime({ targets: '#alarm-clock-ring', duration: 85, easing: 'linear', direction: 'alternate', rotate: [30, -30], loop: true, scale: 1.05 });

    anime({
        ...tlParams,
        autoplay: true,
        update(percent) { target.style.background = `radial-gradient(circle, ${colors[1]} ${(percent.progress) / 2}%, rgba(0,0,0,0.2) ${(percent.progress) * 2}%)`; },
        complete() { tl.restart(); }
    });

    tl.add({
        update(percent) { target.style.background = `radial-gradient(circle, ${colors[0]} ${(percent.progress) / 2}%, ${colors[1]} ${(percent.progress) * 2}%)`; },
        complete() { tll.restart(); }
    }, 0);

    tll.add({
        update(percent) { target.style.background = `radial-gradient(circle, ${colors[1]}  ${(percent.progress)}%, ${colors[0]} ${(percent.progress) * 2}%)`; },
        complete() { setTimeout(() => tl.restart(), 250); }
    }, 0);

    ringTimeout = setTimeout(() => {
        dismiss(false, type);
        setTimeout(() => notifications.create({ 'content': `You missed an alarm a minute ago`, title: 'Alarm missed', icon: 'lnr lnr-clock', 'sound': true }), 60 * 1000);
    }, 60 * 1000);
}

export function dismiss(snooze = false, type: AlarmType = 'alarm') {
    if (tl) tl.pause();
    if (shakeClock) shakeClock.pause();

    if (target) alarmIsRinging.set(false);
    if (target) timerIsRinging.set(false);

    if (ringTimeout) clearTimeout(ringTimeout);
    canBeSummoned.set(true);
    //@ts-ignore
    if (document.getElementById('alarm-audio')) document.getElementById('alarm-audio').pause();

    if (type === 'alarm') {
        clearAlarmMemory(!snooze);
    }

    if (type === 'timer') {
        clearTimerMemory()
    }

    console.log('dismissing timer or alarm');

}

export function clearAlarmMemory(removeTitle = true) {
    alarmTime.set(undefined);
    if (localStorage.getItem('alarmTitle') && removeTitle) localStorage.removeItem('alarmTitle');
}

export function clearTimerMemory(removeTitle = true) {
    timerTime.set(undefined);
    if (localStorage.getItem('timerTitle') && removeTitle) localStorage.removeItem('timerTitle');
}