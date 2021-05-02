import type { AnimeInstance } from 'animejs';
import { styleChangeLock } from '../stores/globalState';

let transitioning = false;
const queue: Array<AnimeInstance> = [];

export function clockTransition(animation: AnimeInstance) {
    queue.push(animation);

    const unsubscribe = styleChangeLock.subscribe(async locked => {
        
        if (!locked && !transitioning) {
            transitioning = true;
            styleChangeLock.set(true);
            
            await execute();
            
            styleChangeLock.set(false);
            transitioning = false;
            unsubscribe();
        }
    });
    
}

async function execute() {
    while (queue.length > 0) {
        console.log(' transiziono');
        const current = queue[0];
        
        current.play();
        await current.finished;

        queue.shift();
    }

    return true;
}