<script lang="ts">
    import SettingsBox from "../../elements/SettingsBox.svelte";
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import Action from "../../elements/settings/Buttons/Action.svelte";
    import { clockStyleClass } from "../../../stores/storedSettings";

    const customClass = "bg-transparend border-2 border-white";

    function setCustomFont(tag: string) {
        if (tag.length) tag = "-" + tag;
        clockStyleClass.set("font" + tag);
    }
</script>

<SettingsBox bordered={false} id="remote-time">
    <Title title="Font">
        <TitleIcon>
            <i class="lnr lnr-pilcrow text-white settings-title-icon" />
        </TitleIcon>
    </Title>
    <PrimaryBox
        label={{ text: "Select an option" }}
        description={{
            text: `Customize the font of the clock`,
        }}
        available={true}
    >
        <div class="flex items-center gap-2">
            <Action 
                on:click={() => setCustomFont("clock")} 
                custom={$clockStyleClass !== "font-clock"} 
                customClass = {$clockStyleClass !=='font-clock' ? customClass : ''}
                label="Default" />
            <Action 
                on:click={() => setCustomFont("monofur")} 
                custom={$clockStyleClass !== "font-monofur"} 
                customClass = {$clockStyleClass !=='font-monofur' ? customClass : ''} 
                label="Monofur" />
            <Action 
                on:click={() => setCustomFont("courier")} 
                custom={$clockStyleClass !== "font-courier"} 
                customClass = {$clockStyleClass !=='font-courier' ? customClass : ''} 
                label="Courier" />
        </div>
    </PrimaryBox>
</SettingsBox>
