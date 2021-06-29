<script lang="ts">
    export let classes: string = ''; 
</script>

<div class="text-primary rounded-2xl p-4 w-80 {classes}">
    <slot></slot>
</div>