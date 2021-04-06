<script lang="ts">
    import SettingsBox from '../elements/SettingsBox.svelte';

    import Title from "../elements/settings/Title.svelte";
    import TitleIcon from "../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../elements/settings/PrimaryBox.svelte";
    import NestedBox from "../elements/settings/NestedBox.svelte";
    import Booleans from "../elements/settings/Buttons/Booleans.svelte";
    import Action from "../elements/settings/Buttons/Action.svelte";
</script>

<div class="w-10/12 flex flex-col md:w-8/12 max-w-2xl m-auto relative">
    <SettingsBox>
        <Title title="High contrast">
            <TitleIcon>
                <i class="lnr lnr-home text-primary settings-title-icon"></i>
            </TitleIcon>
        </Title>
        <PrimaryBox 
            label={{text: 'test'}} 
            description={{label:'Test descripion'}}
            available={true}
        >
            <Booleans state={true} label={'test'}/>
        </PrimaryBox>
    </SettingsBox>

    <SettingsBox>
        <Title title="High contrast">
            <TitleIcon>
                <i class="lnr lnr-home text-primary settings-title-icon"></i>
            </TitleIcon>
        </Title>
        <PrimaryBox 
            label={{text: 'test'}} 
            description={{label:'Test descripion'}}
            available={true}
        >
            <Action label={'CLICK ME'}/>
        </PrimaryBox>
        <NestedBox label={'I am nested'} bordered={true} available={true}/>
    </SettingsBox>
</div>

<style global>
    .settings-btn {
        cursor: pointer;
        border: none;
        transition: color .4s linear;
        outline: none;
    }
    
    .settings-btn:focus {
        border: none;
        outline: none;
    }
    
    .settings-btn:active {
        border: none;
        outline: none;
    }
</style>