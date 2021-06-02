
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
    callback: (params?: string) => void;
    active?: boolean;
}

export interface RoosterShortcut {
    [key: string]: RoosterArgument;
}

export interface RoosterShortcuts {
    state: {[key: string]: RoosterShortcut};
    set: (key: string, value: RoosterShortcut) => void;
    getAll: () => RoosterShortcuts;
    get: (s: string) => RoosterShortcut;
}