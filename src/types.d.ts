
/**
 * The interface exported by the Clock
 */
export interface ClockElements {
    hours: HTMLElement;
    minutes: HTMLElement;
    seconds: HTMLElement;
}

/**
 * 
 */
export interface ClockElementBox {
    x: string;
    y: string;
    visible: boolean;
    el?: HTMLElement;
}

export type mouseWatcherState = 'watch' | 'hide' | 'leave';
export type userSettingType = 'string' | 'int' | 'float' | 'boolean';

export type SpotifyPlayerStatus = 'ready' | 'disconnected' | 'error' | 'connecting';

export interface RoosterArgument {
    callback: (params?: string) => Promise<boolean>;
    active?: boolean;
}

export interface RoosterShortcut {
    arguments: {[key: string]: RoosterArgument};
    color?: string;
    background?: string;
}

export interface RoosterShortcuts {
    state: {[key: string]: RoosterShortcut};
    set: (key: string, value: RoosterShortcut) => void;
    getAll: () => RoosterShortcuts;
    get: (s: string) => RoosterShortcut;
}

export interface Tip {
    name: string;
    shortcut: string;
}