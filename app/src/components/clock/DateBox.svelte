<script lang="ts">
import time from '../../stores/time';
import { fly, fade, scale } from 'svelte/transition';
import type { Moment } from 'moment';
import { RemindersDB } from '../../handlers/RemindersDB';
import { alarmTime } from '../../stores/storedSettings';
import IncomingEventsBox from './IncomingEventsBox.svelte';

let isHovered = false;
</script>

<div class="absolute text-xl text-center text-bg left-2/4 -mt-14 transform -translate-x-1/2 z-20 datebox" 
    on:mouseenter|stopPropagation={() => isHovered = true}
    on:mouseleave|stopPropagation={() => isHovered = false}
    in:fly={{'y': 40, 'duration': 1000}} 
    out:fade={{'duration': 50}}>
    <div class="mb-1">
        <div class="bg-highlighted rounded-full inline-block px-2 py-1">{$time.format('dddd, D MMMM')}</div>
    </div>
    <IncomingEventsBox {isHovered} />
</div>