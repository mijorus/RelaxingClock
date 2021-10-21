import { Writable, writable } from 'svelte/store';
import type { userSettingType } from '../types';

function castValue(value: any) {
    return (typeof value !== 'string') ? JSON.stringify(value) : value;
}

function userSetting(key: string, defaultValue: any, type: userSettingType = 'string') {
    const locallyStoredKey = localStorage.getItem(key);
    
    let value;
    if (locallyStoredKey) {
        value = locallyStoredKey;
    } else if (defaultValue) {
        localStorage.setItem(key, castValue(defaultValue));
        value = defaultValue;
    }
    
    // cast the stored key in the correct type
    if (locallyStoredKey === 'undefined' || locallyStoredKey === 'null') {
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
            case 'object':
                value = JSON.parse(value);
                break;
            case 'array':
                value = JSON.parse(value);
                break;
        }
    }

    const stored: Writable<any> = writable(value);

    function set(value: any) {
        stored.set(value);
        if (value === undefined || value === null) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, castValue(value));
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
export const saveEnergy = userSetting('saveEnergy', false, 'boolean');
// export const longPomodoro = userSetting('longPomodoro', false, 'boolean');//
// export const remoteTime = userSetting('remoteTime', false, 'boolean');
export const loggedWithSpotify = userSetting('userHasLogged', false, 'boolean');
export const saveTracksInCustomPlaylist = userSetting('saveTracksInCustomPlaylist', false, 'boolean');
export const contextHistory = userSetting('contextHistory', [], 'array');

export const weather = userSetting('weather', false, 'boolean');// 
export const lastWeatherUpdate = userSetting('lastWeatherUpdate', {}, 'object');// 
export const tempUnit = userSetting('tempUnit', 'C');

export const analogTimeLocked = userSetting('analogTimeLocked', false, 'boolean');// 