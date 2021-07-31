<script lang="ts">
import { fly } from "svelte/transition";

import { SpotifyPlayer } from "../../handlers/spotify/player";
import { notifications } from "../../stores/notifications";
import { spotifyPlayerStatus, spotifyPlayerState, inQueue } from "../../stores/spotify";
import type { SpotifyPlayerStatus } from "../../types";
import { createCommaArray } from "../../utils/utils";
import AnimatedText from "../elements/AnimatedText.svelte";
import Bubble from "../elements/Bubble.svelte";

    let preloadLabel = '';
    let loader = '';

    let trackName = '';
    let artistsName = [];
    let albumCover: Spotify.Image[];
    let expandedBox = false;
    $: boxClasses = $spotifyPlayerState?.track_window ? "border-transparent	text-primary bg-tertiary text-primary" : 'border-spotify bg-spotify text-bg';
    
    $: {
        if ($inQueue && ($spotifyPlayerState?.track_window?.next_tracks.length > 0)) {
            const queued = $spotifyPlayerState.track_window.next_tracks.find(t => t.uri === $inQueue);
            if (queued) notifications.create({'title': 'Added to queue', 'content': queued.name, 'icon': 'fab fa-spotify'});
            inQueue.set(undefined);
        } else if ($spotifyPlayerState?.track_window && !$inQueue) {
            trackName = $spotifyPlayerState.track_window.current_track.name;
            artistsName = $spotifyPlayerState.track_window.current_track.artists.map(a => a.name);
            albumCover = $spotifyPlayerState.track_window.current_track.album.images;
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

    function togglePlay() {
        if (SpotifyPlayer) SpotifyPlayer.togglePlay();
    }

    function togglePause() {
        if (SpotifyPlayer) SpotifyPlayer.pause();
    }

    function handleForward() {
        if (SpotifyPlayer) SpotifyPlayer.nextTrack();
    }
</script>

<div class="absolute bottom-5 left-5 font-primary">
    {#if expandedBox && albumCover}
        <div transition:fly={{ y: 50, duration: 400 }} class="bg-cover mb-3 max-w-72 p-2 rounded-md flex flex-col items-center text-primary bg-tertiary">
            <img src="{albumCover[albumCover.length - 1].url}" class="w-72 h-auto rounded-xl" alt="">
            <p class="mt-1"><b>[Album]</b>: {$spotifyPlayerState?.track_window.current_track.album.name}</p>
            <p><svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -3 24 24" width="24" height="24" preserveAspectRatio="xMinYMin" class="icon__icon"><path d="M19.548 4.837L16.875 7.51a1 1 0 0 1-1.415-1.414L16.556 5H15.1a5.22 5.22 0 0 0-5.089 4.058A5.264 5.264 0 0 0 15.105 13h1.502l-1.147-1.147a1 1 0 0 1 1.415-1.414l2.828 2.828a.996.996 0 0 1 .282.562 1.006 1.006 0 0 1-.437 1.008l-2.673 2.673a1 1 0 0 1-1.415-1.414L16.556 15h-1.451a7.264 7.264 0 0 1-6.114-3.34A7.22 7.22 0 0 1 2.901 15H1a1 1 0 0 1 0-2h1.901a5.22 5.22 0 0 0 5.06-3.936A5.263 5.263 0 0 0 2.836 5H1a1 1 0 1 1 0-2h1.836a7.264 7.264 0 0 1 6.143 3.387A7.22 7.22 0 0 1 15.1 3h1.508L15.46 1.853A1 1 0 1 1 16.875.439l2.828 2.828a.996.996 0 0 1 .282.562 1.006 1.006 0 0 1-.437 1.008z"></path></svg>
            </p>
        </div>
    {/if}
    <Bubble classes={$spotifyPlayerStatus === 'ready' ? boxClasses + ' rounded-xl border-2 transition-all rounded-xl': ''}>
        <div class="flex flex-row items-center">
            <span class="pr-2" class:flex={albumCover}>
                {#if albumCover}
                    <div class="bg-cover w-14 h-14 rounded-md bg-no-repeat flex items-center justify-center" 
                        style="background-image: url({expandedBox ? '' : albumCover[0].url})"
                    >
                        <span class="lnr lnr-chevron-up cursor-pointer {expandedBox ? 'opacity-100' : 'opacity-0'} hover:opacity-100 transition-all bg-primary bg-opacity-60 p-2 text-primary rounded-full" on:click={() => expandedBox = !expandedBox}/>
                    </div>
                {:else}
                    <i class="fab fa-spotify text-5xl" class:text-secondary={$spotifyPlayerStatus !== 'ready'} />
                {/if}
            </span>
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
            <span class="justify-self-end text-xl absolute p-1 right-4 {$spotifyPlayerState?.track_window ? 'rounded-full bg-opacity-60 bg-primary' : ''}" 
                style="box-shadow: 0px 0px 20px {$spotifyPlayerState?.track_window ? process.env.BACKGROUND_DARK : 'transparent'};"
            >
                {#if $spotifyPlayerStatus === 'ready'}
                    {#if !$spotifyPlayerState || $spotifyPlayerState?.paused}
                        <i class="fas fa-play cursor-pointer" on:click={togglePlay}/>
                    {:else}
                        <i class="fas fa-pause cursor-pointer" on:click={togglePause} on:contextmenu={handleForward}/>
                    {/if}
                {:else if $spotifyPlayerStatus === 'connecting'}
                <div class="transform scale-50 relative">
                    <div class="line-scale">
                        <div></div><div></div><div></div><div></div><div></div>
                    </div>
                </div>
                {:else if $spotifyPlayerStatus !== 'disconnected'}
                <i class="fas fa-exclamation-triangle"></i>
                {/if}
            </span>
       </div>
    </Bubble>
</div>
