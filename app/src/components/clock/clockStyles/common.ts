import { tips } from "../../../stores/globalState";

export function handleMouseEnterCommon(e) {
    tips.set([
        { name:"Increase digit size", shortcut:'Long press' },
        { name:"Change accent color", shortcut:'Right-click' }
    ]);
}

export function handleMouseLeaveCommon(e) {
    tips.set(null);
}