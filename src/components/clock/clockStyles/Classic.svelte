<script lang="ts">
    import { bigClockUpdate, hoursBox, minutesBox, secondsBox } from '../../../stores/clockStyle';
    import { getWidth } from '../../../utils/getBoundingClientRect';

    $: compute($bigClockUpdate);

    async function compute(timestamp: number) {
        if (timestamp) {
            const divSize: number = getWidth(document.getElementById('minutes-divisor'));
            const centerElSize: number = getWidth($minutesBox.el);

            hoursBox.update(el => ({...el, x: `${-(centerElSize + getWidth($hoursBox.el) - divSize)}px`, y: '-50%', visible: true}));
            minutesBox.update(el => ({...el, x: `${-(centerElSize - divSize)}px`, y: '-50%', visible: true}));
            secondsBox.update(el => ({...el, x: `${(divSize)}px`, y: `-50%`, visible: true}));
        }
    }
</script>