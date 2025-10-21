<script lang="ts">
    import SettingsBox from "../../elements/SettingsBox.svelte";
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import Booleans from "../../elements/settings/Buttons/Booleans.svelte";
    import { blink, remoteTime, saveEnergy } from "../../../stores/storedSettings";
    import { onMount } from "svelte";
    import { shortcuts } from "../../../stores/rooster";
    import { fade } from "svelte/transition";
    import axios from "axios";
    import { remoteTimeAdjustmets } from "../../../stores/time";
    import moment from "moment";

    interface RemoteTimeResponse {
        unixtime: number;
        compleated: number;
    }

    let ping: number;
    $: syncClock($remoteTime);

    async function syncClock(remoteTime: boolean) {
        if (!remoteTime) {
            remoteTimeAdjustmets.set(null);
            return;
        }

        try {
            ping = 0;

            const start = Date.now();
            const response = await axios.get("/media/time");
            const serverTime = moment(response.headers["date"]);
            const { timezone } = response.data;
            console.log(serverTime);

            const delta = start - (serverTime.unix() * 1000);

            console.log("Time offset: " + delta + "s");
            remoteTimeAdjustmets.set({ delta, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
        } catch (err) {
            ping = -1;
            remoteTimeAdjustmets.set(null);
            console.error(err);
        }
    }
</script>

<SettingsBox bordered={false} id="remote-time">
    <Title title="Remote time">
        <TitleIcon>
            <i class="lnr lnr-earth text-blue-300 settings-title-icon" />
        </TitleIcon>
    </Title>
    <PrimaryBox
        label={{ text: "Get time from the internet" }}
        description={{
            text: `Syncs your time from the server`,
        }}
        available={true}
    >
        <div class="flex items-center">
            {#if $remoteTime && ping > 0}
                <span class="inline-block text-xs mr-6 rounded-full text-primary">{ping}ms</span>
            {:else if $remoteTime && ping < 0}
                <span class="inline-block text-red-500 mr-6 rounded-full">
                    <i class="fas fa-exclamation-circle" />
                </span>
            {/if}
            <Booleans
                state={$remoteTime}
                label={"efficiency mode"}
                on:change={(e) => remoteTime.set(e.detail)}
            />
        </div>
    </PrimaryBox>
</SettingsBox>
