<script>
import time from '../../stores/time';
import { fly, fade } from 'svelte/transition';
</script>

<div class="absolute text-xl text-center text-bg left-2/4 bottom-4 transform -translate-x-1/2" 
    in:fly={{'y': 40, 'duration': 1000}} 
    out:fade={{'duration': 50}}>
    <span class="bg-highlighted rounded-full inline-block px-2 py-1 -top-10">{$time.format('dddd, D MMMM')}</span>
</div>