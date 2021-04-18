import { screenSaver } from "../stores/globalState";
import type { mouseWatcherState } from "../types";



// export function enable(timeout?: number) {
//     disable();
//     if (timeout) {
//         console.log(`Screen saver timeout set to ${timeout}`);
//         // handleMouseCursor('watch', timeout);
//     } else {
//         setScreenSaver();
//     }
// }

// export function disable() {
//     // clearTimeout(watchMouse);
// }

// // export function setScreenSaverColors() {
// //     if (localStorage.presentation === 'false') {
// //         $(body).removeClass('high-contrast').addClass('screen-saving-color');
// //     } else if (localStorage.presentation === 'true') {
// //         $(body).removeClass('screen-saving-color').addClass('high-contrast');
// //     }
// // }

// function setScreenSaver() {
//     console.log('Starting screen saver');
//     // setScreenSaverColors();
//     // handleMouseCursor('hide');

//     // window.addEventListener('click', () => leaveScreenSaver());

// }

// export function leaveScreenSaver() {
//     if (!isAnimating) {
//         isActive = false;
//         isAnimating = true;
//         $(window).off('click');
//         handleMouseCursor('leave');
//         $(body).removeClass('screen-saving-color high-contrast');
//         $(toScreenSave).removeClass('screen-saving');
//         if (clockStyles[currentPosition].leaveFullScreen) {
//             clockStyles[currentPosition].leaveFullScreen()
//                 .finished.then(() => {
//                     isAnimating = false;
//                 })
//         } else {
//             setTimeout(() => { 
//                 isAnimating = false 
//             }, 750);
//         }

//         handleMouseCursor('watch')
//     }
// }

// var cursorTimeout;
// export function handleMouseCursor(setState: string, timeout = 15000) {     
//     switch (setState) {
//         case 'watch':
//             console.log('Watching for mouse movements...');
//             screenSaverTimeout(timeout);

//             window.addEventListener('mousemove', () => {
//                 screenSaverTimeout(timeout, true);
//             }); 
//             break;

//         case 'hide':
//             // if (!inSettings) $(main).css('cursor', 'none');
//             // $(expandIcon).addClass('hide');
//             $(window).on('mousemove', function() {
//                 $(window).off('mousemove');
//                 showMouseCursor();
//             }); 
//             break;
        
//         case 'leave':
//             clearTimeout(cursorTimeout);
//             $(main).css('cursor', 'auto');
//             $(expandIcon).removeClass('hide');
//             $(window).off('mousemove');
//             break;
//     }
// }

// function showMouseCursor() {
//     $(main).css('cursor', 'auto');
//     $(expandIcon).removeClass('hide');
//     $(window).on('mousemove', function() {
//         clearTimeout(cursorTimeout);
//         cursorTimeout = setTimeout(function() {
//             $(window).off('mousemove');  
//             handleMouseCursor('hide');               
//         }, 2500);
//     });
// }

// function screenSaverTimeout(timeout, mouse = false) {
//     clearTimeout(watchMouse);
//     watchMouse = setTimeout(() => {
//         if (!mouse) console.log('No mouse movement detected');
//         $(window).off('mousemove');
//         enableScreenSaver(1);
//     }, timeout)
// }


export default {
    timeoutHandler: undefined,

    timeout: 0,

    enable(state: boolean) {
        screenSaver.set(state);
    },

    set(t: number = 0) {
        this.disable();
        
        this.timeout = t;
        console.log(`Screen saver timeout set to ${this.timeout}`);

        setTimeout(() => this.enable(true), this.timeout);
    },

    disable() {
        this.enable(false);
    },

    // handleMouseCursor(state: mouseWatcherState) {
    //     switch (state) {
    //         case 'watch':
    //             console.log('Watching for mouse movements...');
    //             // screenSaverTimeout(timeout);

    //             this.timeoutHandler = setTimeout(this.set(), this.timeout);
    
    //             window.addEventListener('mousemove', () => {
    //                 clearTimeout(this.timeoutHandler);
    //                 this.timeoutHandler = setTimeout(this.set(), this.timeout);
    //             }); 
    //             break;
    
    //         case 'hide':
    //             // if (!inSettings) $(main).css('cursor', 'none');
    //             // $(expandIcon).addClass('hide');
    //             // $(window).on('mousemove', function() {
    //             //     $(window).off('mousemove');
    //             //     showMouseCursor();
    //             // }); 
    //             break;
            
    //         case 'leave':
    //             // clearTimeout(cursorTimeout);
    //             // $(main).css('cursor', 'auto');
    //             // $(expandIcon).removeClass('hide');
    //             // $(window).off('mousemove');
    //             break;
    //     }
    // }
}