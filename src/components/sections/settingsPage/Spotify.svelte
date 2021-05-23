<script lang="ts">
    import SettingsBox from '../../elements/SettingsBox.svelte';
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import Action from "../../elements/settings/Buttons/Action.svelte";
    import { onMount } from 'svelte';
    import { generateSpotifyUrl } from '../../../lib/spotify/generateSpotifyUrl';
    import { urlParams } from '../../../utils/utils';
    // import { userHasLogged } from '../../../stores/storedSettings';
    import { spotifyUrl } from '../../../stores/spotify';

    function handleBtnClick() {
        if ($spotifyUrl) {
            window.location.replace($spotifyUrl);
        }
    }
</script>

<SettingsBox>
    <Title title="Spotify">
        <TitleIcon>
            <i class="icon-lightbulb text-primary settings-title-icon"></i>
        </TitleIcon>
    </Title>
    <PrimaryBox 
        label={{text: 'Login with Spotify'}} 
        description={{text:''}}
        available={true}
    >
        <Action label={$spotifyUrl ? 'Login' : 'Logout'} on:click={handleBtnClick}/>
    </PrimaryBox>
</SettingsBox>