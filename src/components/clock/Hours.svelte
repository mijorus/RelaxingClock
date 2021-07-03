<script lang="ts">
    import time from "../../stores/time";
    import { clockFormat } from "../../stores/storedSettings";
    import type { Moment } from "moment";
import anime from "animejs";
import { eaElasticDefault } from "../../utils/animations";

    let hours: string;
    $: setHours($time, $clockFormat);

    let oldFormat: string;
    function setHours(time: Moment, clockFormat) {
        if (oldFormat === clockFormat) {
            hours = time.format(clockFormat === '24h' ? 'HH' : 'hh');
        } else {
            oldFormat = clockFormat;
            anime({
                targets: '#hours',
                duration: 500,
                rotateX: [0, 360],
                complete() {time.format(clockFormat === '24h' ? 'HH' : 'hh')}
            })
        }
    }
</script>

<span id="hours">{ $time.format($clockFormat === '24h' ? 'HH' : 'hh') }</span>