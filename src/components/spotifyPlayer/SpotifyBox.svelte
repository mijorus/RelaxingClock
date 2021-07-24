<script lang="ts">
import { fade } from "svelte/transition";

import { SpotifyPlayer } from "../../handlers/spotify/player";
import { SpotifyClient } from "../../lib/spotify/SpotifyClient";
import { spotifyPlayerStatus, spotifyPlayerState, track_window, inQueue } from "../../stores/spotify";
import type { SpotifyPlayerStatus } from "../../types";
import { createCommaArray } from "../../utils/utils";
import AnimatedText from "../elements/AnimatedText.svelte";
import Bubble from "../elements/Bubble.svelte";

    let preloadLabel = '';
    let loader = '';
    let trackName = '';
    let artistsName = [];

    $: {
        console.log($inQueue, 'dfsdf');
        if ($inQueue && $spotifyPlayerState?.track_window?.next_tracks.length) {
            trackName = '[Queued] ' + ($spotifyPlayerState.track_window.next_tracks.pop()).name;
            artistsName = ($spotifyPlayerState.track_window.next_tracks.pop()).artists.map(a => a.name);
            setTimeout(() => { inQueue.set(false) }, 5000);

        } else if ($spotifyPlayerState?.track_window && !$inQueue) {
            trackName = $spotifyPlayerState.track_window.current_track.name;
            artistsName = $spotifyPlayerState.track_window.current_track.artists.map(a => a.name);
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
</script>

<div class="absolute bottom-5 left-5">
    <Bubble classes={$spotifyPlayerStatus === 'ready' ? 'border-2 transition-all rounded-xl border-primary' : ''}>
       <div class="flex flex-row items-center">
            <span class="pr-2">
                <i class="fab fa-spotify {$spotifyPlayerStatus === 'ready' ? 'text-spotify' : 'text-secondary'} text-5xl" />
            </span>
            <div class="text-xl font-primary flex-grow whitespace-nowrap overflow-hidden">
                <!-- Track title -->
                <div class="whitespace-nowrap tracking-normal">
                    <AnimatedText text={$spotifyPlayerState?.track_window ? trackName : preloadLabel}>
                        {#if $spotifyPlayerStatus !== 'ready'}<span>{loader}</span>{/if}
                    </AnimatedText>
                </div>
                <!-- Artist and stuff -->
                {#if $spotifyPlayerState?.track_window}
                    <div class="text-secondary text-sm whitespace-nowrap tracking-tight">
                        <AnimatedText text={createCommaArray(artistsName)}>
                        </AnimatedText>
                    </div>
                {/if}
            </div>
            <span class="justify-self-end text-xl">
                {#if $spotifyPlayerStatus === 'ready'}
                    {#if !$spotifyPlayerState || $spotifyPlayerState?.paused}
                        <i class="fas fa-play cursor-pointer" on:click={togglePlay}/>
                    {:else}
                        <i class="fas fa-pause cursor-pointer" on:click={togglePause}/>
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
