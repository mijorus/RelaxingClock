import { screenSaver } from "../stores/globalState";

export default {
    timeoutHandler: undefined,
    timeout: 0,
    
    enable() {
        clearTimeout(this.timeoutHandler);
        screenSaver.set(true);
        console.log(`Screen saver set`);
    },
    
    set(t: number = 0) {
        this.disable();    
        this.timeout = t;
        this.timeoutHandler = setTimeout(() => this.enable(), this.timeout);
    },

    disable() {
        clearTimeout(this.timeoutHandler);
        screenSaver.set(false);
    },
}