import { Writable, writable } from 'svelte/store';
import type { userSettingType } from '../types';

function userSetting(key: string, defaultValue: any, type: userSettingType = 'string') {
    const locallyStoredKey = localStorage.getItem(key);
    
    let value;
    if (locallyStoredKey) {
        value = locallyStoredKey;
    } else if (defaultValue) {
        localStorage.setItem(key, defaultValue.toString());
    }
    
    // cast the stored key in the correct type
    if (value === 'undefined' || value === 'null') {
        value = undefined;
    } else if (typeof value !== type && typeof value === 'string') {
        switch (type) {
        case 'int': 
            value = parseInt(value);
            break;
        case 'float': 
            value = parseFloat(value);
            break;
        case 'boolean': 
            value = (value === 'true');
            break;
        }
    }

    const stored: Writable<any> = writable(value);

    function set(value: string | number) {
        stored.set(value);
        if (value === undefined || value === null) {
            localStorage.removeItem(key);
        } else {
            if (typeof value !== 'string') value = JSON.stringify(value);
            localStorage.setItem(key, value);
        }
    }

    return {
        set,
        subscribe: stored.subscribe,
    };
}

/**
 * Below we have all the settings that will be stored in localStorage. Each time one of these 
 * setting is updated, we save a stringified reference in the browser
 */
export const activeStyle = userSetting('defaultPosition', 0, 'int');
export const clockFormat = userSetting('defaultClockFormat', '24h');
export const alarmTime = userSetting('alarmTime', undefined, 'int');
export const blink = userSetting('blink', true, 'boolean');
export const presentation = userSetting('presentation', false, 'boolean');
export const longPomodoro = userSetting('longPomodoro', false, 'boolean');
export const remoteTime = userSetting('remoteTime', false, 'boolean');
export const loggedWithSpotify = userSetting('userHasLogged', false, 'boolean');