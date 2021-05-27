import type { AnimeInstance } from 'animejs';
import { styleChangeLock } from '../stores/globalState';
import { get } from 'svelte/store';

let transitioning = false;
const queue: Array<AnimeInstance> = [];

export async function clockTransition(...animations: Array<AnimeInstance>) {
    queue.push(...animations);

    get(styleChangeLock)

    if (!get(styleChangeLock) && !transitioning) {
        transitioning = true;
        styleChangeLock.set(true);
        
        await execute();
        
        styleChangeLock.set(false);
        transitioning = false;
    }
}

async function execute() {
    while (queue.length > 0) {
        const current = queue[0];
        
        current.play();
        await current.finished;

        queue.shift();
    }

    return true;
}