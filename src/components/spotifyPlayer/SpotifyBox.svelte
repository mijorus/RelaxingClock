<script lang="ts">
import moment from "moment";
import momentDurationFormatSetup from 'moment-duration-format';
import { fade, fly, slide } from "svelte/transition";
import { SpotifyPlayer } from "../../handlers/spotify/login";
import { SpotifyClient } from "../../lib/spotify/SpotifyClient";
import { screenSaver, tips } from "../../stores/globalState";
import { notifications } from "../../stores/notifications";
import { spotifyPlayerStatus, spotifyPlayerState, spotifyUrl } from "../../stores/spotify";
import { contextHistory } from "../../stores/storedSettings";
import time from "../../stores/time";
import type { LastPlayedContexts, SpotifyPlayerStatus } from "../../types";
import { createCommaArray, deepClone } from "../../utils/utils";
import AnimatedText from "../elements/AnimatedText.svelte";
import Bubble from "../elements/Bubble.svelte";
import SmoothImage from "../elements/SmoothImage.svelte";
import Heart from "../icons/Heart.svelte";
import Repeat from "../icons/Repeat.svelte";
import Shuffle from "../icons/Shuffle.svelte";
import Spotify from "../sections/settingsPage/Spotify.svelte";

    momentDurationFormatSetup(moment);

    let preloadLabel = '';
    let loader = '';

    let trackName = '';
    let lastUri: string;
    let artistsName = [];
    let currentTrackIsLiked = false;
    let albumCover: Spotify.Image[];
    let expandedBox = false;
    let playbackStarted = false;
    let songPosition = 0; //seconds since the track started

    $: boxClasses = $screenSaver && !playbackStarted 
        ? 'bg-transparent border-transparent' 
        : playbackStarted ? "border-transparent text-primary bg-tertiary text-primary" : 'border-transparent bg-tertiary text-primary';
    
    $: {
        if ($spotifyPlayerState?.track_window) {
            playbackStarted = true;
            trackName = $spotifyPlayerState.track_window.current_track.name;
            artistsName = $spotifyPlayerState.track_window.current_track.artists.map(a => a.name);
            albumCover = $spotifyPlayerState.track_window.current_track.album.images;
            songPosition = ~~($spotifyPlayerState.position / 1000);

            const thisUri = $spotifyPlayerState.track_window.current_track.uri;
            if (thisUri !== lastUri) {
                const ctx = $spotifyPlayerState.context.uri;
                if (ctx.length) {
                    let history: LastPlayedContexts[] = deepClone($contextHistory);
                    
                    if (history.length > 5) history.pop();
                    if (!history.find(el => el.uri === ctx)) history.unshift({
                        uri: ctx, name: $spotifyPlayerState.context.metadata.context_description, 
                        date: Date.now()
                    });
                    
                    contextHistory.set(history);
                }
                

                localStorage.setItem('lastPlayedTrack', Date.now() + '::' + thisUri);
                checkTrackIsSaved($spotifyPlayerState.track_window.current_track.id);
            }
            
            lastUri = thisUri;
        } else {
            expandedBox = false;
        }
    }

    $: {
        if (!$spotifyPlayerState?.paused && $spotifyPlayerState?.duration && $time) {
            songPosition = $spotifyPlayerState.duration === songPosition ? songPosition : songPosition + 1;
        }
    }
    
    $: setLabel($spotifyPlayerStatus);

    let interval: NodeJS.Timeout;
    function setLabel(spotifyStatus: SpotifyPlayerStatus) {
        clearInterval(interval);
        if (spotifyStatus === 'connecting') {
            preloadLabel = 'Loading'; let count = 0;
            interval = setInterval(() => {
                if (count < 3) { loader += '.'; count++ }
                else { count = 0; loader = '' }
            }, 250);
        }  else {
            loader = '';
            if (spotifyStatus === 'ready') preloadLabel = 'Ready to play!';
            else if (spotifyStatus !==  'disconnected') preloadLabel = 'Ooops!';
        }
    }

    async function checkTrackIsSaved(trackId: string) {
        currentTrackIsLiked = (await SpotifyClient.containsMySavedTracks([trackId]))[0];
    }

    async function toggleSavedTrack() {
        currentTrackIsLiked
            ? await SpotifyClient.removeFromMySavedTracks([$spotifyPlayerState.track_window.current_track.id])
            : await SpotifyClient.addToMySavedTracks([$spotifyPlayerState.track_window.current_track.id]);
        
        currentTrackIsLiked = !currentTrackIsLiked;
    }

    function togglePlay() {
        if (SpotifyPlayer) SpotifyPlayer.togglePlay();
    }

    function togglePause() {
        if (SpotifyPlayer) SpotifyPlayer.pause();
        localStorage.removeItem('lastPlayedTrack');
    }

    function handleForward(e) {
        e.preventDefault(); e.stopPropagation();
        if (SpotifyPlayer) SpotifyPlayer.nextTrack();
    }

    function handleWindowKeydown(e: KeyboardEvent) {
        if ($spotifyPlayerState && e.code === 'Space' && !e.ctrlKey && document.activeElement === document.querySelector('body')) {
            e.preventDefault();
            e.stopPropagation();
            $spotifyPlayerState.paused ? togglePlay() : togglePause();
        }

        else if ($spotifyPlayerState?.track_window && e.ctrlKey && e.key === 'E' && document.activeElement === document.querySelector('body')) {
            e.preventDefault();
            expandedBox = !expandedBox;
        }
    }

    let goToPreviousTrackTimeout: NodeJS.Timeout;
    let gtptn = 0;
    function goToPreviousTrack() {
        gtptn++;
        clearTimeout(goToPreviousTrackTimeout);

        goToPreviousTrackTimeout = setTimeout(() => {
            (songPosition < 3 || gtptn > 1) ? SpotifyPlayer.previousTrack() : SpotifyPlayer.seek(0);
            gtptn = 0;
        }, 350);
    } 

    function copyCurrentTrackLink() {
        if (!$spotifyPlayerState?.track_window) return;
        navigator.clipboard.writeText('https://open.spotify.com/track/'+ $spotifyPlayerState?.track_window.current_track.id);
        notifications.create({'limitDisplay': 'notificationOnly', 'title': 'Track link copied', 'content': 'The track link was copied in the clipboard', 'icon': 'fas fa-link'});
    }
</script>

<svelte:window on:keydown={handleWindowKeydown}/>
<div class="absolute bottom-5 left-5 font-primary">
    {#if expandedBox && albumCover}
        <div transition:fly={{ y: 50, duration: 400 }} class="absolute w-80 bottom-full bg-cover mb-3 p-2 rounded-xl flex flex-col items-center text-primary bg-tertiary">
            <SmoothImage src="{albumCover[albumCover.length - 1].url}" classes="w-full h-auto rounded-xl" />
            <p class="mt-1 relative text-center whitespace-nowrap w-full overflow-hidden">
                <AnimatedText text={$spotifyPlayerState?.track_window.current_track.album.name + ($spotifyPlayerState?.context?.uri.match('playlist') ? ` - ${$spotifyPlayerState.context.metadata.context_description}` : '')}/>
            </p>
            <p class="mt-1 flex items-center">
                <i class="mx-2 cursor-pointer inline-block fas fa-backward text-{$spotifyPlayerState?.loading ? 'secondary pointer-events-none' : 'primary'}" 
                    on:click={() => goToPreviousTrack()}></i>
                <i class="mx-1 cursor-pointer inline-block" on:click={() => SpotifyClient.setShuffle(!$spotifyPlayerState.shuffle)}>
                    <Shuffle color={$spotifyPlayerState?.shuffle ? process.env.SPOTIFY_COLOR : process.env.TEXT_SECONDARY} />
                </i>
                <i class="mx-1 cursor-pointer" on:click={() => toggleSavedTrack()}>
                    <Heart filled={currentTrackIsLiked} color={process.env[currentTrackIsLiked ? 'SPOTIFY_COLOR' : 'TEXT_SECONDARY']}/>
                </i>
                <i class="mx-1 fas fa-link cursor-pointer hover:text-spotify transition-colors" on:click={() => copyCurrentTrackLink()}>
                </i>
                <i class="mx-1 cursor-pointer inline-block" on:click={() => SpotifyClient.setRepeat($spotifyPlayerState?.repeat_mode === 0 ? 'context' : 'off')}>
                    <Repeat color={$spotifyPlayerState?.repeat_mode === 0 ? process.env.TEXT_SECONDARY : process.env.SPOTIFY_COLOR} />
                </i>
                <i class="mx-2 fas fa-forward cursor-pointer inline-block text-{$spotifyPlayerState?.loading ? 'secondary pointer-events-none' : 'primary'}" 
                    on:click={() => SpotifyPlayer.nextTrack()}></i>
            </p>
            <p class="text-secondary mt-1">
                {moment.duration(songPosition, 's').format('mm:ss', { trim: false })}/{moment.duration($spotifyPlayerState?.duration, 'millisecond').format('mm:ss', { trim: false })}
            </p>
            <p class="mt-1 text-xs text-secondary text-center" style="line-height: 1;">
                <span class="lnr lnr-question-circle"></span> Use Spotify Connect to control <br>
                "<b>Relaxing Clock</b>" with the phone app
            </p>
        </div>
    {/if}
    <Bubble classes={$spotifyPlayerStatus === 'ready' ? boxClasses + ' rounded-xl border-2 transition-all rounded-xl': ''}>
        <div class="flex flex-row items-center">
            <!-- the spotify or album icon -->
            <span class="pr-2" class:flex={albumCover}>
                {#if albumCover && $spotifyPlayerState}
                    <div class="bg-cover w-14 h-14 rounded-md bg-no-repeat flex items-center justify-center" 
                        style="background-image: url({expandedBox ? '' : albumCover[0].url})"
                    >
                        <span class="lnr lnr-chevron-up cursor-pointer {expandedBox ? 'opacity-100' : 'opacity-0'} hover:opacity-100 transition-all bg-primary bg-opacity-60 p-2 text-primary rounded-full" 
                            on:click={() => expandedBox = !expandedBox} on:mouseenter={() => tips.set([{'name': 'Expand', 'shortcut': 'Ctrl+Shift+E'}])} on:mouseleave={() => tips.set(null)}/>
                    </div>
                {:else}
                    <!-- the spotify icon -->
                    <i class="fab fa-spotify text-5xl 
                        {($spotifyPlayerStatus === 'ready' && !playbackStarted && $screenSaver) ? 'text-primary opacity-80' : ''}" 
                        class:text-spotify={$spotifyPlayerStatus === 'ready' && !$screenSaver}
                        class:text-secondary={$spotifyPlayerStatus !== 'ready'}
                        class:cursor-pointer={$spotifyUrl} 
                        on:click={() => { if ($spotifyUrl) window.location.replace($spotifyUrl) }}/>
                {/if}
            </span>
            <!-- the center textarea -->
            {#if playbackStarted || !$screenSaver}
                <div class="text-xl flex-grow whitespace-nowrap overflow-hidden">
                    <!-- Track title -->
                    <div class="whitespace-nowrap tracking-normal font-bold">
                        <AnimatedText text={$spotifyPlayerState?.track_window ? trackName : preloadLabel}>
                            {#if $spotifyPlayerStatus !== 'ready'}<span>{loader}</span>{/if}
                        </AnimatedText>
                    </div>
                    <!-- Artist and stuff -->
                    {#if $spotifyPlayerState?.track_window}
                        <div class="text-secondary font-bold text-sm whitespace-nowrap tracking-tight">
                            <AnimatedText text={createCommaArray(artistsName)}/>
                        </div>
                    {/if}
                </div>
            {/if}
            <!-- the box to the right of the bubble where the play button is located -->
            <span class="justify-self-end text-xl absolute p-1 right-4 transition-all {playbackStarted ? 'rounded-full bg-opacity-60 bg-primary' : ''}" 
                style="box-shadow: 0px 0px 20px {playbackStarted ? process.env.BACKGROUND_DARK : 'transparent'};">
                {#if $spotifyPlayerStatus === 'ready' && !$spotifyPlayerState?.loading}
                    {#if playbackStarted || !$screenSaver}
                        {#if !$spotifyPlayerState || $spotifyPlayerState?.paused}
                        <i class="fas fa-play cursor-pointer" on:click={togglePlay}/>
                        {:else}
                            <i class="fas fa-pause cursor-pointer" on:click={togglePause} on:contextmenu={handleForward}/>
                        {/if} 
                    {/if}
                {:else if $spotifyPlayerStatus === 'connecting' || ($spotifyPlayerStatus === 'ready' && $spotifyPlayerState?.loading)}
                    <div class="transform scale-50 relative" style="transform-origin: right;">
                        <div class="line-scale m-0 p-0">
                            <div></div><div></div><div></div><div></div><div></div>
                        </div>
                    </div>
                {:else if $spotifyPlayerStatus !== 'disconnected'}
                    <i class="fas fa-exclamation-triangle" class:opacity-50={$screenSaver}></i>
                {/if}
            </span>
       </div>
    </Bubble>
</div>
