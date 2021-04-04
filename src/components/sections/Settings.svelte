<script lang="ts">
    import Title from "../elements/settings/Title.svelte";
    import PrimaryBox from "../elements/settings/PrimaryBox.svelte";
    import NestedBox from "../elements/settings/NestedBox.svelte";
    import Buttons from "../elements/settings/Buttons.svelte";
</script>

<div class="w-2/4 flex flex-col md:w-8/12 m-auto">
    <div>
        <Title title="High contrast"><i class="lnr lnr-home text-primary"></i></Title>
        <PrimaryBox 
            label={{text: 'test'}} 
            description={{label:'Test descripion'}}
            available={true}
        ></PrimaryBox>
    </div>

    <div>
        <Title title="Time"><i class="lnr lnr-home text-primary"></i></Title>
        <PrimaryBox 
            label={{text: 'test'}} 
            description={{label:'Test descripion'}}
            available={false}
        ></PrimaryBox>
    </div>
</div>