<script lang="ts">
    import Clock from '../clock/Clock.svelte';
    import FullScreenBtn from '../elements/FullScreenBtn.svelte';
    import StyleSelectionBox from "../elements/StyleSelectionBox.svelte";
</script>

<FullScreenBtn />

<div class="h-full flex flex-col justify-center items-center">
    <Clock />

    <StyleSelectionBox />
</div>