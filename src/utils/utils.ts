import anime from "animejs";

//Get the URL params
const queryString = window.location.search;
export const urlParams = new URLSearchParams(queryString);

export function numToString(n: number) : string {
    return (typeof n === 'number') ? n.toString() : n;
}

export function caretToEnd(textNode: HTMLElement) {
    if (textNode.childNodes[0]?.textContent) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(textNode.childNodes[0], textNode.childNodes[0].textContent.length);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        textNode.focus();
    }
}

export function shakeElement(el: HTMLElement) {
    return anime({
        targets: el,
        duration: 70,
        translateX: [10, -10, 0],
        easing: 'linear',
        loop: 4,
        direction: 'alternate'
    });
}