<script lang="ts">
    export let title: string;
</script>

<h2>
    <slot></slot>
    <span class="text-xl text-primary">{title}</span>
</h2>