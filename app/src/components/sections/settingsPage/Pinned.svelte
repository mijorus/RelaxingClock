<script lang="ts">
    import SettingsBox from "../../elements/SettingsBox.svelte";
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import Pin from "../../icons/Pin.svelte";
    import Action from "../../elements/settings/Buttons/Action.svelte";
    import { pinnedDBisReady } from "../../../stores/globalState";
    import { altLabel } from "../../../costants";

    function triggerRooster(e) {
        window.dispatchEvent(new CustomEvent("injectRoosterAction", { detail: { command: "pin", argument: '' } }));
    }
</script>

<SettingsBox unsupported={!$pinnedDBisReady} id="pinned-settings">
    <Title title="Pins">
        <TitleIcon noFill>
            <Pin color="red" size="36" />
        </TitleIcon>
    </Title>
    <PrimaryBox
        label={{ text: "Pin a new message" }}
        description={{ text: "Create a new reminder which will always stay on top using the Rooster", iconClass: "lnr lnr-question-circle" }}
        available={true}
        shortcut={altLabel + ' + p'}
        >
        <Action label="Create" on:click={triggerRooster} />
    </PrimaryBox>
</SettingsBox>
