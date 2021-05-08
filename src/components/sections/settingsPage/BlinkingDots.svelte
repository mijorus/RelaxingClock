<script lang="ts">
    import SettingsBox from '../../elements/SettingsBox.svelte';
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import Booleans from "../../elements/settings/Buttons/Booleans.svelte";
</script>

<SettingsBox>
    <Title title="Blinking dots">
        <TitleIcon>
            <i class="lnr lnr-home text-primary settings-title-icon"></i>
        </TitleIcon>
    </Title>
    <PrimaryBox 
        label={{text: 'Let the dots pulsing at rhythm'}} 
        description={{text:'Keep the colors bright and vivid when the screen saver is active, super useful if you want'}}
        available={true}
    >
        <Booleans state={true} label={'test'}/>
    </PrimaryBox>
</SettingsBox>