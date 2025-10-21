<script lang="ts">
    import SettingsBox from "../../elements/SettingsBox.svelte";
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import Action from "../../elements/settings/Buttons/Action.svelte";
    import { clockStyleClass } from "../../../stores/storedSettings";

    const customClass = "bg-transparent";

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
        hideLabelOnMobile={true}
        description={{
            text: `Customize the font of the clock`,
        }}
        available={true}
    >
        <div class="flex flex-wrap items-center gap-2">
            <Action
                on:click={() => setCustomFont("clock")}
                custom={$clockStyleClass !== "font-clock"}
                label="Default"
            />
            <Action
                on:click={() => setCustomFont("monofur")}
                custom={$clockStyleClass !== "font-monofur"}
                label="Monofur"
            />
            <Action
                on:click={() => setCustomFont("courier")}
                custom={$clockStyleClass !== "font-courier"}
                label="Courier"
            />
            <Action
                on:click={() => setCustomFont("sono")}
                custom={$clockStyleClass !== "font-sono"}
                label="Sono"
            />
            <Action
                on:click={() => setCustomFont("workbench")}
                custom={$clockStyleClass !== "font-workbench"}
                label="Workbench"
            />
            <Action
                on:click={() => setCustomFont("wenkai")}
                custom={$clockStyleClass !== "font-wenkai"}
                label="Wenkai"
            />
        </div>
        <!-- <div class="flex items-center gap-2">
        </div>
        <div class="flex items-center gap-2">
        </div> -->
    </PrimaryBox>
</SettingsBox>
