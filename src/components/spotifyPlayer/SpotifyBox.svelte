<script lang="ts">
    import { spotifyPlayerStatus } from "../../stores/spotify";
    import type { SpotifyPlayerStatus } from "../../types";
    import AnimatedText from "../elements/AnimatedText.svelte";
    
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
        }  else if (spotifyStatus === 'ready') {
            loader = '';
            label = 'Ready to play!';
        }
    }
</script>

<div class="flex flex-row items-center absolute bottom-5 left-5 text-primary border-2 rounded-2xl p-4 w-80">
    <span class="pr-2">
        <i class="fab fa-spotify text-spotify text-5xl"></i>
    </span>
    <span class="text-xl font-primary flex-grow">
       <AnimatedText text={label}><span>{loader}</span></AnimatedText>
    </span>
    <span class="justify-self-end text-xl">
        <i class="fas fa-play"></i>
    </span>
</div>