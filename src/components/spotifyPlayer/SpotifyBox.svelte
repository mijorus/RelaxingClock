<script lang="ts">
    import { spotifyPlayerStatus } from "../../stores/spotify";
    import type { SpotifyPlayerStatus } from "../../types";

    let label: string = '';
    $: setLabel($spotifyPlayerStatus);

    let interval: NodeJS.Timeout;
    function setLabel(spotifyStatus: SpotifyPlayerStatus) {
        clearInterval(interval);
        if (spotifyStatus === 'connecting') {
            label = 'Loading';

            let count = 0
            interval = setInterval(() => {
                if (count < 3) { label += '.'; count++ }
                else { count = 0; label = label.replaceAll('.', '') }
            }, 250);
        }
    }
</script>

<div class="flex flex-row items-center absolute bottom-5 left-5 text-primary border-2 rounded-2xl p-4 w-80">
    <span class="pr-2">
        <i class="fab fa-spotify text-spotify text-5xl"></i>
    </span>
    <span class="text-xl font-primary flex-grow">
        {label}
    </span>
    <span class="justify-self-end text-xl">
        <i class="fas fa-play"></i>
    </span>
</div>