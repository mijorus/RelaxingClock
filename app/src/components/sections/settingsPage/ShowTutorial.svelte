<script lang="ts">
    import SettingsBox from "../../elements/SettingsBox.svelte";
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import Action from "../../elements/settings/Buttons/Action.svelte";
    import { modalContent } from "../../../stores/globalState";
    import IntroTutorialModal from "../../modals/IntroTutorialModal.svelte";
    import SurveyModal from "../../modals/SurveyModal.svelte";
    import UpdateModal from "../../modals/UpdateModal.svelte";
</script>

<SettingsBox bordered={false} id="show-tutorial">
    <Title title="Show tutorial">
        <TitleIcon noFill>
            <i class="lnr lnr-spell-check text-primary settings-title-icon" />
        </TitleIcon>
    </Title>
    <PrimaryBox label={{ text: "Show the introduction tutorial again" }} description={{ text: "Just in case you missed something...", iconClass: "lnr lnr-question-circle" }} available={true}>
        <Action label="Open" on:click={() => modalContent.set(IntroTutorialModal)} />
    </PrimaryBox>
</SettingsBox>
