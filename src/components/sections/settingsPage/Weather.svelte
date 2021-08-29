<script lang="ts">
import SettingsBox from '../../elements/SettingsBox.svelte';
import Title from "../../elements/settings/Title.svelte";
import TitleIcon from "../../elements/settings/TitleIcon.svelte";
import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
import Booleans from "../../elements/settings/Buttons/Booleans.svelte";
import NestedBox from '../../elements/settings/NestedBox.svelte';

</script>

<SettingsBox>
    <Title title="Weather">
        <TitleIcon>
            <svg class="w-16" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 1550 1160"><g fill="rgb(234,108,73)" style="transform: none;"><g><path d="M330 1101 c-14 -27 -13 -37 6 -55 12 -13 39 -16 128 -16 97 0 115 -3 129 -18 22 -24 21 -38 -3 -62 -18 -18 -33 -20 -185 -20 -146 0 -165 -2 -173 -17 -15 -27 3 -62 35 -68 43 -9 58 -20 61 -44 7 -43 -13 -51 -122 -51 -117 0 -140 -9 -134 -55 3 -26 8 -30 36 -33 32 -3 32 -3 32 -89 0 -47 7 -113 16 -147 45 -177 186 -327 362 -388 97 -33 268 -32 362 3 231 87 380 309 368 549 -3 65 -3 65 82 70 85 5 85 5 88 35 6 53 -6 55 -284 55 -278 0 -288 2 -268 58 7 21 19 28 52 35 33 6 43 13 48 33 9 36 -12 54 -62 54 -69 0 -106 47 -66 83 16 14 44 17 188 17 178 0 194 4 194 45 0 45 -2 45 -452 45 -412 0 -428 -1 -438 -19z"></path><path d="M1052 918 c-37 -37 7 -78 84 -78 69 0 104 25 86 64 -11 25 -16 26 -85 26 -43 0 -78 -5 -85 -12z"></path><path d="M1322 918 c-18 -18 -14 -56 7 -68 28 -14 124 -13 145 3 12 9 17 23 14 42 -3 30 -3 30 -78 33 -50 2 -79 -1 -88 -10z"></path></g></g></svg>
        </TitleIcon>
    </Title>
    <PrimaryBox 
        label={{text: 'Enable weather'}} 
        description={{text:'Forecasts provided by openweathermap.org', iconClass: 'lnr lnr-question-circle'}}
        available={true}
    >
        <Booleans state={true} label={'weather'} />
    </PrimaryBox>
    <NestedBox expandable label="Manually set location" >
        <div class="p-2">
            <div class="flex flex-row items-center w-2/3 m-auto bg-tertiary py-1 px-2 rounded-md">
                <i class="lnr lnr-magnifier mx-2"></i> <input type="text" class="bg-transparent">
            </div>
        </div>
    </NestedBox>
</SettingsBox>