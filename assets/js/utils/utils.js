import { cbDefault } from "../init";
import { player }    from "../spotify/player";
import { paused }    from "../spotify/playerListeners";
//Get the URL params
export function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

//Handle the settings loader animation
export function handleLoader(target, show, success = true, enabled = true) {
    ($(target).find('.status-icon')).remove();
    if (enabled) {
        $(target).removeClass('hide');
        const el = $(target).find('.loader');
        const animProp = { duration: 200, targets: $(el).get(0) };
        if (show) {
            $(el).removeClass('disp-none');
            return anime({ 
                ...animProp,
                opacity: [0, 1], 
            });
        } else {
            return anime({
                ...animProp,
                opacity: [1, 0], 
                complete: () => {
                    $(el).addClass('disp-none');

                    // Success can be undefined if we dont want
                    // to show any confirmation icon
                    if (success === true) {
                        $(target).append('<i class="status-icon icon-checkmark"></i>');
                    } else if (success === false) {
                        $(target).append('<i class="status-icon icon-cross"></i>');
                    }
                }
            });
        }
    } else {
        $(target).addClass('hide');
    }
}

//Get a random song position
export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Change button lable with animation
export function changeBtnLable(target, nextMessage, dur = 650) {
    if (nextMessage) {
        anime({
            targets: $(target).get(0),
            direction: 'alternate',
            duration: dur,
            loop: 1,
            easing: cbDefault,
            opacity: [1, 0],
            loopComplete: () => {
                $(target).text(`${nextMessage}`);
            }
        });
    }
}

let handlingMusic = false;
let oldPlaybackState = {
    status: false, //if the playback was paused or not (true if it was, false if it was playing)
    volume: undefined,
}

export function checkNotificationStatus (targetLable) {
    return new Promise (function (resolve) {
        const perm = Notification.permission;

        if (perm === 'granted') {
            console.log(`Notifications enabled`);
            return resolve(true)
        } else if (perm !== 'denied' || perm === "default") {
            if (targetLable) changeBtnLable($(targetLable), 'Please allow notifications permission');
            console.warn(`Notifications: missing permission!`);
            Notification.requestPermission().then(function (result) {
                if (result === 'granted') {
                    return resolve(true)
                } else {
                    return resolve(false)
                }
            })
        }
    })
}

export function handleMusic (turnDown) {
    if (player !== undefined) {
        if (!handlingMusic) {
            if (turnDown) {
                oldPlaybackState.status = paused;
                player.getVolume().then(volume => {
                    oldPlaybackState.volume = volume;
                    if (!oldPlaybackState.status) {
                        const newVolume = 0.2;
                        if (newVolume <= volume) player.setVolume(newVolume);
                    }
                });

                if (!oldPlaybackState.status) {
                    const newVolume = 0.2;
                    if (newVolume <= oldPlaybackState.volume) player.setVolume(newVolume);
                }
            } else {
                if (oldPlaybackState.volume !== undefined) {
                    player.setVolume(oldPlaybackState.volume);
                    if (!oldPlaybackState.status) player.resume();
                }
            }
        }
    }
}

export function toggleArrow(target, directionUp) {
    if(directionUp) {
        $(target).addClass('point-up')
    } else {
        $(target).removeClass('point-up')
    }
}

export function removeSpace (str) {
    return str.replace(/\s+/g, '');
};