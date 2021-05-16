export function numToString(n: number) : string {
    return (typeof n === 'number') ? n.toString() : n;
}