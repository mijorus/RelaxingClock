<script lang="ts">
    export let label: string;
    const btnsClass: string = 'text-md settings-btn px-2 py-1 border-primary border-2 rounded-xl font-primary font-bold relative z-10';
</script>

<button class="{btnsClass} text-secondary bg-highlighted" alt="{label}" on:click>{label}</button>