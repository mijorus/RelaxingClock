//Get the URL params
const queryString = window.location.search;
export const urlParams = new URLSearchParams(queryString);

export function numToString(n: number) : string {
    return (typeof n === 'number') ? n.toString() : n;
}