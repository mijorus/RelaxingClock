import { accessDenied }         from './spotify/auth';
import { setScreenSaverColors } from './screenSaver';
import { pomodoro }             from './pomodoro';
import { alarm }                from './alarm';
import { getRemoteTime }        from "./clocks";
import { compatibility }        from "./compatibilityDetector";
import { logout }               from "./spotify/auth";
import { generateUrl, 
        redirectURI }           from "./utils/generateSpotifyUrl";
import { setBlink }             from './getSettings';

const settingsSection = $('#settings-section');
var btns = settingsSection.find('button');

setSpotifyLoginButton();
getButtonSettings();

//Spotify login button
function setSpotifyLoginButton() {
    const logoutBtn = $('#spotify-logout-btn');

    if (localStorage.userHasLogged == 'true') {
        $(logoutBtn).text('Logout');
    } else if (localStorage.userHasLogged == 'false') {
        if (!accessDenied) {
            $(logoutBtn).text('Login'); 
        } else {
            $(logoutBtn).text('Reload'); 
        }
    }
}

function getButtonSettings() {
   [
        {
            stored: localStorage.presentation,
            button: 'presentation'
        },
        {
            stored: localStorage.remoteTime,
            button: 'remote-time',
            callback: (localStorage.remoteTime === 'true') ? getRemoteTime(true) : null
        },
        {
            stored: localStorage.longPomodoro,
            button: 'pom-long',
        },
        {
            stored: localStorage.blink,
            button: 'blink',
        },
   ].forEach((setting) => {
        const val = (setting.button).toLocaleLowerCase();
        if (setting.stored === 'true') {
            setButtonSelection($(settingsSection).get(0).querySelector(`#${val}-on`), setting.callback);
        } else if (setting.stored === 'false') {
            setButtonSelection($(settingsSection).get(0).querySelector(`#${val}-off`), setting.callback);
        }
   });
}

//Helper function
function setButtonSelection(target, callback) {
    if (target.dataset.option == 'on') {
        target.classList.add('activated');
        target.nextElementSibling.classList.remove('activated');
    } else if (target.dataset.option == 'off') {
        target.classList.add('activated');
        target.previousElementSibling.classList.remove('activated');
    }

    if (callback) callback();
}

//Actions to be executed on button click
export function handleSettingButtons() {
    for (btn of $(btns)) {
        $(btn).on('click', function(event) {
            event.stopPropagation();
            setButtonSelection(event.target);

            switch (event.target.id) {
                case 'spotify-logout-btn':
                    if (localStorage.userHasLogged === 'true') {
                        logout();
                    } else if (localStorage.userHasLogged === 'false' && compatibility.login) {
                        if (!accessDenied) {
                            generateUrl()
                                .then((url) => {
                                    window.location.replace(url);
                                })
                        } else {
                            logout();
                            window.location.replace(redirectURI);
                        }
                    }
                break;

                case 'presentation-on':
                    localStorage.presentation = 'true';
                    setScreenSaverColors();
                break;

                case 'presentation-off':
                    localStorage.presentation = 'false';
                    setScreenSaverColors();
                break;

                case 'set-alarm-btn':
                    if (!alarm.enabled) {
                        alarm.openPage();
                    } else {
                        alarm.dismiss(false);
                    }
                break;

                case 'set-pomodoro-btn':
                    if (!pomodoro.running) {
                        pomodoro.start();
                    } else {
                        pomodoro.stop();
                    }
                break;

                case 'pom-long-on':
                    localStorage.longPomodoro = 'true';
                break;

                case 'pom-long-off':
                    localStorage.longPomodoro = 'false';
                break;

                case 'pom-notif-on':
                    if (compatibility.notification) {
                        if (pomodoro.running) {
                            pomodoro.notifications(true);
                        }
                    }
                break;

                case 'pom-notif-off':
                    if (compatibility.notification) {
                        if (pomodoro.running) {
                            pomodoro.notifications(false);
                        }
                    }
                break;

                case 'alarm-notif-on':
                    if (compatibility.notification) {
                        if (alarm.enabled) {
                            alarm.notifications(true);
                        } 
                    }
                break;

                case 'alarm-notif-off':
                    if (compatibility.notification) {
                        if (alarm.enabled) {
                            alarm.notifications(false);
                        }
                    }
                break;

                case 'remote-time-on':
                    getRemoteTime(true);
                    localStorage.remoteTime = 'true';
                break;

                case 'remote-time-off':
                    getRemoteTime(false);
                    localStorage.remoteTime = 'false';
                break;

                case 'blink-on':
                    setBlink('true');
                break;

                case 'blink-off':
                    setBlink('false');
                break;
            }
        });
    }
}