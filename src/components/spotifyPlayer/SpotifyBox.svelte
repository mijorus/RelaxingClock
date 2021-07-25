<script lang="ts">
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
    let albumCover: string;

    $: {
        if ($inQueue && ($spotifyPlayerState?.track_window?.next_tracks.length > 0)) {
            const queued = $spotifyPlayerState.track_window.next_tracks.find(t => t.uri === $inQueue);
            if (queued) notifications.create({'title': 'Added to queue', 'content': queued.name, 'icon': 'fab fa-spotify'});
            inQueue.set(undefined);
        } else if ($spotifyPlayerState?.track_window && !$inQueue) {
            trackName = $spotifyPlayerState.track_window.current_track.name;
            artistsName = $spotifyPlayerState.track_window.current_track.artists.map(a => a.name);
            albumCover = $spotifyPlayerState.track_window.current_track.album.images[0].url;
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

<div class="absolute bottom-5 left-5">
    <Bubble classes={$spotifyPlayerStatus === 'ready' ? 'border-2 transition-all rounded-xl border-primary' : ''}>
       <div class="flex flex-row items-center">
            <span class="pr-2">
                {#if albumCover}
                    <img src="{albumCover}" alt="" class="rounded-md w-14">
                {:else}
                    <i class="fab fa-spotify {$spotifyPlayerStatus === 'ready' ? 'text-spotify' : 'text-secondary'} text-5xl" />
                {/if}
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
            <span class="justify-self-end text-xl absolute p-1 right-4 rounded-full bg-opacity-60 bg-primary" style="box-shadow: 0px 0px 20px {process.env.BACKGROUND_DARK};">
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
