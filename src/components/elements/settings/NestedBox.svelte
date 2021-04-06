<script lang="ts">
    export let label: string;
    export let available: boolean = true;
    export let bordered: boolean = true;

</script>

<div class="w-full md:w-9/12 bg-secondary rounded-xl p-3 md:p-4 m-3 md:m-4 self-end
    {available ? 'opacity-100' : 'opacity-50 pointer-events-none'} 
    {bordered ? 'border-l-4 border-primary' : 'border-none'}"
>
    <span class="text-primary font-primary text-md">{label}</span>
    <slot></slot>
</div>