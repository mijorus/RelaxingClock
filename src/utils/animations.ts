import { styleChangeLock } from "../stores/globalState";

export const cbDefault: string = 'cubicBezier(0.37, 0, 0.63, 1)';
export const eaElasticDefault: string = 'spring(1, 60, 10, 0)';

export function lockApp() {
    styleChangeLock.set(true);
    setTimeout(() => styleChangeLock.set(false), 350);       
}