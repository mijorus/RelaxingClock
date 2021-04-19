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
}

export type mouseWatcherState = 'watch' | 'hide' | 'leave';