<script lang="ts">
    import { spotifyPlayerStatus } from "../../stores/spotify";
    import type { SpotifyPlayerStatus } from "../../types";
    import AnimatedText from "../elements/AnimatedText.svelte";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { shortcuts } from "../../stores/rooster";
    import Bubble from "../elements/Bubble.svelte";

    let label = '';
    let loader = '';
    $: setLabel($spotifyPlayerStatus);

    let interval: NodeJS.Timeout;
    function setLabel(spotifyStatus: SpotifyPlayerStatus) {
        clearInterval(interval);
        if (spotifyStatus === 'connecting') {
            label = 'Loading';
            let count = 0
            interval = setInterval(() => {
                if (count < 3) { loader += '.'; count++ }
                else { count = 0; loader = '' }
            }, 250);
        }  else {
            loader = '';
            if (spotifyStatus === 'ready') {
                label = 'Ready to play!';
            } else if (spotifyStatus !==  'disconnected') {
                label = 'Ooops!';
            }
        }
    }

    // onMount(() => {
    //     shortcuts.set('spotify', {
    //         background: process.env.SPOTIFY_COLOR,
    //         color: process.env.BACKGROUND_DARK,
    //         arguments: {
    //             playlist: {
    //                 async callback(params) {
    //                     console.log('playlist set to ', params);
    //                     return true;
    //                 }
    //             }
    //         }
    //     })
    // })
</script>

<div class="absolute bottom-5 left-5">
    <Bubble classes={$spotifyPlayerStatus === 'ready' ? 'border-2 transition-all rounded-xl border-primary' : ''}>
       <div class="flex flex-row items-center">
            <span class="pr-2">
                <i class="fab fa-spotify {$spotifyPlayerStatus === 'ready' ? 'text-spotify' : 'text-secondary'} text-5xl" />
            </span>
            <span class="text-xl font-primary flex-grow">
                <AnimatedText text={label}><span>{loader}</span></AnimatedText>
            </span>
            <span class="justify-self-end text-xl">
                {#if $spotifyPlayerStatus === 'ready'}
                <i class="fas fa-play" />
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
