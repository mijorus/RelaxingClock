import { tips } from "../../../stores/globalState";

export function handleMouseEnterCommon(e) {
    tips.set([
        { name:"Increase digit size", shortcut:'Long press hours digit' },
        { name:"Change accent color", shortcut:'Right-click hours digit' }
    ]);
}

export function handleMouseLeaveCommon(e) {
    tips.set(null);
}