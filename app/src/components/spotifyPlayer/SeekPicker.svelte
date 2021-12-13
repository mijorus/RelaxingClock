<script lang="ts">
    import moment from "moment";
    import momentDurationFormatSetup from 'moment-duration-format';
    momentDurationFormatSetup(moment);

    export let position: number = undefined;
    export let seek: number = undefined;
    export let duration: number = undefined;
</script>

{moment.duration(seek ?? position, 's').format('mm:ss', { trim: false })}/{moment.duration(duration, 'millisecond').format('mm:ss', { trim: false })}