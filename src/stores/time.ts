import { Readable, readable } from "svelte/store";
import moment, { Moment } from "moment";

const time:Readable<Moment> = readable(moment(), (set) => {
    const i:number = setInterval(() => {
        set(moment())
    }, 1000);

    return () => {
        clearInterval(i);
    }
})

export default time;