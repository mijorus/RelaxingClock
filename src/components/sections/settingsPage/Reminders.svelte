<script lang="ts">
    import SettingsBox from '../../elements/SettingsBox.svelte';
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import Booleans from "../../elements/settings/Buttons/Booleans.svelte";
    import Action from '../../elements/settings/Buttons/Action.svelte';
    import NestedBox from '../../elements/settings/NestedBox.svelte';
</script>

<div class="fixed bottom-2 p-4 h-auto font-primary bg-secondary text-primary transform -translate-x-2/4 left-2/4 rounded-2xl">
    <h2 class="text-4xl font-bold mr-20">Create a reminder</h2>
    <Action label="Create"/>
</div>

<SettingsBox>
    <Title title="Reminders">
        <TitleIcon>
            <i class="lnr lnr-calendar-full text-primary settings-title-icon" style="color: #57ceff;"></i>
        </TitleIcon>
    </Title>
    <PrimaryBox 
        label={{text: 'Create a reminder'}} 
        description={{text:'Set and manage reminders', iconClass: 'lnr lnr-question-circle'}}
        available={true}
    >
        <Action label="Create"></Action>
    </PrimaryBox>
    <NestedBox available={true} label="test"></NestedBox>
</SettingsBox>