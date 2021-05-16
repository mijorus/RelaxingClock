import { Writable, writable } from 'svelte/store';
import type { userSettingType } from '../types';

function userSetting(key: string, defaultValue: any, type: userSettingType = 'string') {
    const localStoredKey = localStorage.getItem(key);
    
    localStoredKey 
        ? defaultValue = localStoredKey 
        : localStorage.setItem(key, JSON.stringify(defaultValue));
    
    if (typeof defaultValue !== type) {
        switch (typeof defaultValue) {
        case 'string':
            if (type === 'int') {
                defaultValue = parseInt(defaultValue);
            } else if (type === 'float') {
                defaultValue = parseFloat(defaultValue);
            }

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
 * Below we have all the settings that will be stored in localStorage. Each time one of this 
 * setting is updated, we save a stringified reference in the browser
 */
export const activeStyle = userSetting('defaultPosition', 0, 'int');