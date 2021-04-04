<script lang="ts">
    export let label: string;
    export let available: boolean;
    export let bordered: boolean = true;

</script>

<div class="w-9/12 bg-secondary rounded-md 
    {available ? 'opacity-100' : 'opacity-50 pointer-events-none'} 
    {bordered ? 'border-l-4 border-primary' : 'border-none'}"
>
    <span class="text-primary font-primary text-md">{label}</span>
    <slot></slot>
</div>