import { get, Readable, readable, writable, Writable } from 'svelte/store';
import moment, { Moment } from 'moment-timezone';

interface RemoteTimeAdjustmetsInterface {
    delta: number;
    timezone: string;
}

export const remoteTimeAdjustmets: Writable<RemoteTimeAdjustmetsInterface> = writable(null);

const time:Readable<Moment> = readable(moment(), (set) => {
    const i = setInterval(() => {
        console.log(get(remoteTimeAdjustmets));
        
        if (get(remoteTimeAdjustmets)) set( moment((Date.now() - (get(remoteTimeAdjustmets).delta)), 'x').tz(get(remoteTimeAdjustmets).timezone) );
        else set(moment());
    }, 1000);

    return () => {
        clearInterval(i);
    };
});

export default time;