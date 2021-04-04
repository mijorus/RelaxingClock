<script lang="ts">
    import SettingsBox from '../elements/SettingsBox.svelte';

    import Title from "../elements/settings/Title.svelte";
    import TitleIcon from "../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../elements/settings/PrimaryBox.svelte";
    import NestedBox from "../elements/settings/NestedBox.svelte";
    import Buttons from "../elements/settings/Buttons.svelte";
</script>

<div class="w-2/4 flex flex-col md:w-8/12 m-auto relative">
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
        </PrimaryBox>
    </SettingsBox>
</div>