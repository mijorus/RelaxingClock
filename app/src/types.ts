
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
export type userSettingType = 'string' | 'int' | 'float' | 'boolean'| 'object'| 'array';

export type SpotifyPlayerStatus = 'ready' | 'disconnected' | 'error' | 'connecting' | 'expired' | 'non-premium' | 'access_denied' | 'waiting_interaction';

// Rooster (command bar)
export type RoosterExamples = {group?: RoosterExample[], namespace?: string, tips?: {'0'?: string, '1'?: string, '2'?: string}};
export type RoosterExampleImageSize = 'md' | 'sm';
export interface RoosterExample {
    argument?: string; 
    example: string; 
    tip?: string;
    image?: string;
    size?: RoosterExampleImageSize;
    id?: string | number;
    selectable?: boolean;
    sortingKey?: number;
}

export interface RoosterShortcut {
    arguments: {[key: string]: RoosterArgument};
    color?: string;
    background?: string;
    examples?: (arg: string, params?: string) => Promise<RoosterExamples>;
}

// 1 = Ctrl + Enter, 2 = Ctrl + Shift + Enter, 3 = Quick Launch
export type RoosterActionType = 1 | 2 | 3;

export interface RoosterArgument {
    description?: string;
    quickLaunchTriggerActions?: boolean;
    callback: (params?: string, selectedItem?: string | number, action?: RoosterActionType) => Promise<boolean>;
    active?: boolean;
    hideInModal?: boolean;
    quickLaunch?: string; // a key that will autofill the rooster with command and argument
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

export interface CustomNotification {
    id?: number;
    title: string;
    content: string;
    icon?: string;
    color?: string;
    elementId?: string;
    timestamp?: number;
    sound?: boolean;
    onlyOnSidePanel?: boolean;
    limitDisplay?: 'sidePanelOnly' | 'notificationOnly'  
}

export type ReminderType = 'simple' | 'repeated';
export interface Reminder {
    title: string;
    at: number;
    type: ReminderType;
    done: boolean;
    doneAt?: number; 
}

export interface StoredReminder extends Reminder {
    id?: number;
}

export interface LastPlayedContexts {
    uri: string;
    name: string;
    date: number;
}

// Custom event for injecting Rooster actions
export interface InjectRoosterActionEvent extends CustomEvent {
    detail: {command: string, argument: string}
}

// Incoming events
export type IncomingEventMessage = {icon: string, text?: string}