import anime from "animejs";

//Get the URL params
const queryString = window.location.search;
export const urlParams = new URLSearchParams(queryString);

export function numToString(n: number) : string {
    return (typeof n === 'number') ? n.toString() : n;
}

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
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


export function groupBy(array: Array<any>, key: string) {
  // Return the end result
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
  }, {}); // empty object is the initial value for result object
}


export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function createCommaArray(array: Array<string>) {
  let string = '';
  array.forEach((s, i) => (i < array.length - 1) ? string += `${s}, ` : string += s)
  return string;
}

export function kTemperatureConverter(valNum: number, output: 'C' | 'F'): number {
  return output === 'C' ? (valNum-273.15) : (((valNum-273.15)*1.8)+32);
}

export function outerWidth(el: HTMLElement) {
  var width = el.offsetWidth;
  var style = getComputedStyle(el);

  width += parseInt(style.marginLeft) + parseInt(style.marginRight);
  return width;
}

export function outerHeight(el: HTMLElement) {
  var height = el.offsetHeight;
  var style = getComputedStyle(el);

  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height;
}

let lastCustomColor: string;
export const customColors: string[] = [
    "#9b5de5",
    "#f15bb5",
    "#f94144",
    "#f3722c",
    "#f9c74f",
    "#fee440",
    "#a1ff0a",
    "#90be6d",
    "#43aa8b",
    "#4d908e",
    "#277da1", 
    "#00bbf9",
    "#00f5d4",
]; 
export function randomCustomColor() {
  let availableColors = [];
  customColors.forEach(el => { if (el !== lastCustomColor) availableColors.push(el)});
  lastCustomColor = availableColors[getRandomIntInclusive(0, (availableColors.length - 1))];
  return lastCustomColor;
}

export function polarToCartesian(radius, angleInDegrees, centerX = radius, centerY = radius) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

export function describeArc(radius, startAngle, endAngle, x = radius, y = radius) {
    const start = polarToCartesian(radius, endAngle, x, y);
    const end = polarToCartesian(radius, startAngle, x, y);
    const largeArcFlag = (endAngle - startAngle <= 180) ? "0" : "1";

    const d = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;

    return {
        d: d,
        x: start.x,
        y: start.y,
    };
}

/**
 * A wrapper for localStorage
 * @var valueToSet leave empty to get the value of an item, pass `null` to remove an item from the localStorage 
 */
export function locSto(key: string, valueToSet: string = undefined) {
    if (valueToSet === undefined) {
        return localStorage.getItem(key);
    } else {
        if (valueToSet === null) localStorage.removeItem(key);
        else localStorage.setItem(key, valueToSet);

        return valueToSet;
    }
}

export function randomBool() {
  return (Math.random() > 0.5);
}

export function deepClone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}