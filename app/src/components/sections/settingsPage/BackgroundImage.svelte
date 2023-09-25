<script lang="ts">
    import SettingsBox from "../../elements/SettingsBox.svelte";
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import Booleans from "../../elements/settings/Buttons/Booleans.svelte";
    import { backgroundImage, blink, saveEnergy } from "../../../stores/storedSettings";
    import { onMount } from "svelte";
    import { shortcuts } from "../../../stores/rooster";
</script>

<SettingsBox bordered={false} id="background-image">
    <Title title="Background image">
        <TitleIcon>
            <i class="lnr lnr-leaf text-green-500 settings-title-icon" />
        </TitleIcon>
    </Title>
    <PrimaryBox
        label={{ text: "Set a background image" }}
        description={{
            text: "Reduce motion and animations when the window in not in focus. Can help if your laptop is running on battery or you want to reduce the impact on your GPU",
            iconClass: "lnr lnr-question-circle",
        }}
        available={true}
    >
        <Booleans state={$backgroundImage?.length} label={"Background image"} on:change={(e) => {
             backgroundImage.set(e.detail ? 'https://img.peapix.com/742a3b0ab5b04b2b83aea1df0863dd49.jpg' : '')
        }} />
    </PrimaryBox>
</SettingsBox>
