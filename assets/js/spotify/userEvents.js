import { musicBox }       from "./init";
import { spotifyIcon }    from "./playerListeners";
import { playerIsBusy, 
        player,
        song }            from "./player";
import { play,
        isLiked,
        playbackStarted } from "./requests";
import { deviceID,
        currentTrack }  from "./playerListeners";
import { cbDefault }      from "js/init";
import { toggleArrow }    from '../utils/utils'
import { playlistLoader } from "./playlists/playlistLoader";

export var likeBtn, playBtn, songInfo;

export function initPlayerEvents() {
    likeBtn  = $('.like-btn');
    playBtn  = $('.play-btn');
    songInfo = $('#song-info');
    
    //Listeners
    playBtnListener();

    likeBtnListener();

    volumeScrollListener();

    albumCoverLister();

    playlistSelector();
}

function playBtnListener() {
    $(playBtn).on('click', function(event) {
        event.preventDefault(); event.stopPropagation();
        if (!playerIsBusy()) {
            if (!playbackStarted) {
                play(deviceID, {
                    context_uri: song.context_uri,
                    offset: song.offset,
                });
            } else {
                player.getCurrentState()
                    .then((state) => {
                        if (state) {
                            state.paused 
                                ? player.resume().then(() => { console.log('Playback Resumed!') })
                                : player.pause().then(() => { console.log('Music Paused!') });
                        } else {
                            //reconnect(true);
                        }
                });
            }
        }
    });

    $(playBtn).on('contextmenu', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (!playerIsBusy()) {
            if (playbackStarted) {
                player.nextTrack().then(() => {
                    console.log('Skipped to next track!');
                });
            }
        }
    });
}

function likeBtnListener() {
    $(likeBtn).on('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!playerIsBusy() && playbackStarted) {
            isLiked(currentTrack.id, true);
        }
    });
}

function volumeScrollListener() {
    let volTimeout;
    const muteWarning = $('#mute-warning');

    $(musicBox).get(0).addEventListener('wheel', (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!playerIsBusy() && playbackStarted) {
            player.getVolume().then((volume) => {
                const volumeStep = 0.05;
                let newVolume;
                (volume !== null) 
                    ? volume = parseFloat(volume.toFixed(2)) 
                    : volume = 0;

                console.log(volume);
                if (event.deltaY > 0) {
                    //Volume DOWN
                    newVolume = volume - volumeStep;
                    if (newVolume >= 0) player.setVolume(newVolume);
                } else {
                    //Volume UP
                    newVolume = volume + volumeStep;
                    if (newVolume <= 1) player.setVolume(newVolume);
                }

                let roundVolume = (newVolume > 0) ? parseInt(newVolume * 100) : 0;
                if (roundVolume > 0) {
                    clearTimeout(volTimeout);
                    if (roundVolume > 100) roundVolume = 100;
                    $(muteWarning).removeClass('hide').html(`${roundVolume}%`);
                    volTimeout = setTimeout(() => $(muteWarning).addClass('hide'), 750);
                } else if (roundVolume <= 0) {
                    clearTimeout(volTimeout);
                    $(muteWarning).removeClass('hide').html(`<i id="volume-mute" class="fas fa-volume-mute"></i>`);
                }

                console.log(`Volume set to ${roundVolume}%`);
            });
        }

    }, { passive: false });
}

var coverClickLock = false;
function albumCoverLister() {
    $(spotifyIcon).hover(() => {
        if (!coverClickLock) $(songInfo).removeClass('hide');
    }, () => {
        if (!coverClickLock) $(songInfo).addClass('hide');
    })
        .on('click', () => {
            if (!coverClickLock) {
                coverClickLock = true;
                $(songInfo).removeClass('hide');
            } else {
                coverClickLock = false;
                $(songInfo).addClass('hide')
            }
        })
}

function playlistSelector() {
    $('#expand-playlist').on('click', () => {
        const playlistListBox = $('#playlist-list-box');

        const animationProp = {
            targets: $(playlistListBox).get(0),
            duration: 350,
            easing: cbDefault,
        };

        if (playlistListBox.hasClass('compact')) {
            playlistLoader(playlistListBox);
            
            anime({
                ...animationProp,
                begin: () => { 
                    $(playlistListBox).removeClass('compact');
                    toggleArrow($('#expand-playlist-arrow'), true)
                },
                maxHeight: [0, '51vh']
            });
        } else {
            anime({
                begin: () => {
                    toggleArrow($('#expand-playlist-arrow'), false)
                },
                ...animationProp,
                maxHeight: 0,
                complete: () => { $(playlistListBox).addClass('compact') }
            });
        }
    })
} 