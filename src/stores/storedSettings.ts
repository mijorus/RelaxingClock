import { Writable, writable } from 'svelte/store';
import type { userSettingType } from '../types';

function userSetting(key: string, defaultValue: any, type: userSettingType = 'string') {
    const locallyStoredKey = localStorage.getItem(key);
    
    if (locallyStoredKey) {
        defaultValue = locallyStoredKey;
    } else if (defaultValue) {
        localStorage.setItem(key, defaultValue.toString());
    }
    
    if (typeof defaultValue !== type && typeof defaultValue === 'string') {
        switch (type) {
        case 'int': 
            defaultValue = parseInt(defaultValue);
            break;
        case 'float': 
            defaultValue = parseFloat(defaultValue);
            break;
        case 'boolean': 
            defaultValue = JSON.parse(defaultValue);
            break;
        }
    }

    const stored: Writable<any> = writable(defaultValue);

    function set(value: string | number) {
        stored.set(value);
        
        if (typeof value !== 'string') value = JSON.stringify(value);
        localStorage.setItem(key, value);
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
export const savedAlarm = userSetting('alarmTime', undefined, 'int');
export const blink = userSetting('blink', true, 'boolean');
// export const userHasLogged = userSetting('userHasLogged', false, 'boolean');
export const presentation = userSetting('presentation', false, 'boolean');
export const longPomodoro = userSetting('longPomodoro', false, 'boolean');
export const remoteTime = userSetting('remoteTime', false, 'boolean');