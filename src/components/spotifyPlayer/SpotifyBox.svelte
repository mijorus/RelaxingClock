<script lang="ts">
import { fly } from "svelte/transition";

import { SpotifyPlayer } from "../../handlers/spotify/player";
import { SpotifyClient } from "../../lib/spotify/SpotifyClient";
import { spotifyPlayerStatus, spotifyPlayerState } from "../../stores/spotify";
import type { SpotifyPlayerStatus } from "../../types";
import { createCommaArray } from "../../utils/utils";
import AnimatedText from "../elements/AnimatedText.svelte";
import Bubble from "../elements/Bubble.svelte";
import SmoothImage from "../elements/SmoothImage.svelte";
import Repeat from "../icons/Repeat.svelte";
import Shuffle from "../icons/Shuffle.svelte";

    let preloadLabel = '';
    let loader = '';

    let trackName = '';
    let artistsName = [];
    let albumCover: Spotify.Image[];
    let expandedBox = false;

    $: boxClasses = $spotifyPlayerState?.track_window ? "border-transparent	text-primary bg-tertiary text-primary" : 'border-spotify bg-spotify text-bg';
    
    $: {
        if ($spotifyPlayerState?.track_window) {
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
        <div transition:fly={{ y: 50, duration: 400 }} class="absolute bottom-full bg-cover mb-3 p-2 rounded-md flex flex-col items-center text-primary bg-tertiary">
            <SmoothImage src="{albumCover[albumCover.length - 1].url}" classes="w-80 h-auto rounded-xl" />
            <p class="mt-1"><b>[Album]</b>: {$spotifyPlayerState?.track_window.current_track.album.name}</p>
            <p>
                <i class="cursor-pointer inline-block" on:click={() => SpotifyClient.setShuffle(!$spotifyPlayerState.shuffle)}>
                    <Shuffle color={$spotifyPlayerState?.shuffle ? process.env.SPOTIFY_COLOR : process.env.TEXT_SECONDARY} />
                </i>
                <i class="cursor-pointer inline-block" on:click={() => SpotifyClient.setRepeat($spotifyPlayerState?.repeat_mode === 0 ? 'context' : 'off')}>
                    <Repeat color={$spotifyPlayerState?.repeat_mode === 0 ? process.env.TEXT_SECONDARY : process.env.SPOTIFY_COLOR} />
                </i>
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
