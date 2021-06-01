//Get the URL params
const queryString = window.location.search;
export const urlParams = new URLSearchParams(queryString);

export function numToString(n: number) : string {
    return (typeof n === 'number') ? n.toString() : n;
}

export function caretToEnd(textNode: HTMLElement) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(textNode.childNodes[0], textNode.childNodes[0].textContent.length);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    textNode.focus();
}