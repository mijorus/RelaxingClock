<script lang="ts">
    import SettingsBox from "../../elements/SettingsBox.svelte";
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import Pin from "../../icons/Pin.svelte";
    import Action from "../../elements/settings/Buttons/Action.svelte";
    import { surveyUrl } from "../../../costants";
</script>

<SettingsBox bordered={false}>
    <Title title="Feedback">
        <TitleIcon noFill>
            <span class="lnr lnr-bullhorn text-pink-300"></span>
        </TitleIcon>
    </Title>
    <PrimaryBox label={{ text: "Share feedback" }} description={{ text: "Share your experience with Relaxing Clock",  iconClass: 'lnr lnr-question-circle' }} available={true}>
        <Action label="Open" on:click={() => window.open(surveyUrl, '_blank')} />
    </PrimaryBox>
</SettingsBox>
