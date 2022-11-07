<script lang="ts">
    import SettingsBox from "../../elements/SettingsBox.svelte";
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import { onMount } from "svelte";
    import axios from "axios";
    import Action from "../../elements/settings/Buttons/Action.svelte";
    import { fade } from "svelte/transition";
    import { getRandomIntInclusive } from "../../../utils/utils";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import { modalContent } from "../../../stores/globalState";
    import SurveyModal from "../../modals/SurveyModal.svelte";
    import UpdateModal from "../../modals/UpdateModal.svelte";
    import NestedBox from "../../elements/settings/NestedBox.svelte";

    let protip: string|null = null;
    let protips: {text: string}[] = [];
    let tipIndex = 0;

    function nextTip(e) {
        tipIndex = (tipIndex === protips.length - 1) ? 0 : tipIndex + 1;
        protip = protips[tipIndex].text;
    }

    onMount(async () => {
        try {
            protips = (await axios.get("/protips.json")).data;
            tipIndex = getRandomIntInclusive(0, (protips.length -1));
            protip = protips[tipIndex].text;

        } catch (e) {
            protip = null;
        }
    });
</script>

<SettingsBox id="protips" collapsable={true} unsupported={protip === null}>
    <Title title="Tips and tricks">
        <TitleIcon>
            <svg width="65" height="65" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M11 10.9794C11 10.4271 11.4477 9.97937 12 9.97937C12.5523 9.97937 13 10.4271 13 10.9794V16.9794C13 17.5317 12.5523 17.9794 12 17.9794C11.4477 17.9794 11 17.5317 11 16.9794V10.9794Z"
                    fill="currentColor"
                />
                <path
                    d="M12 6.05115C11.4477 6.05115 11 6.49886 11 7.05115C11 7.60343 11.4477 8.05115 12 8.05115C12.5523 8.05115 13 7.60343 13 7.05115C13 6.49886 12.5523 6.05115 12 6.05115Z"
                    fill="currentColor"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z"
                    fill="currentColor"
                />
            </svg>
        </TitleIcon>
    </Title>
   
    {#if protip}
        <div class="settings-box-element-title my-5 mx-2">
            <div transition:fade class="settings-box-element">
                <p class="text-white py-5">{@html protip}</p>
                <div>
                    <Action custom customClass="bg-transparend border-2 border-white" label="Next tip" on:click={nextTip}/>
                </div>
            </div>
        </div>
    {/if}

    <NestedBox bordered label={"Take a survey" } description={"Help us improving Relaxing Clock"} available={true}>
        <Action label="Show me" on:click={() => modalContent.set(SurveyModal)} />
    </NestedBox >
    <NestedBox bordered label={"Latest news" } description={"Check what\'s new with the latest version"} available={true}>
        <Action label="Open" on:click={() => modalContent.set(UpdateModal)} />
    </NestedBox >
</SettingsBox>
