<script lang="ts">
    import SettingsBox from '../../elements/SettingsBox.svelte';
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import Action from "../../elements/settings/Buttons/Action.svelte";
    import { spotifyPlayerStatus, spotifyUrl } from '../../../stores/spotify';
    import { logout } from '../../../handlers/spotify/login';

    let boxLabel: string;
    $: switch($spotifyPlayerStatus) {
        case 'disconnected':
            boxLabel = 'Login with Spotify';
            break;
        case 'connecting':
            boxLabel = 'Connecting...';
            break;
        case 'ready':
            boxLabel = 'Logged in as you_name_here';
            break;
        case 'error':
            boxLabel = 'Error!';
            break;
    }



    function handleBtnClick() {
        $spotifyUrl ? window.location.replace($spotifyUrl) : logout();
    }
</script>

<SettingsBox>
    <Title title="Spotify">
        <TitleIcon>
            <i class="icon-lightbulb text-primary settings-title-icon"></i>
        </TitleIcon>
    </Title>
    <PrimaryBox 
        label={{text: boxLabel}} 
        description={{text:''}}
        available={true}
    >
        <Action label={$spotifyUrl ? 'Login' : 'Logout'} on:click={handleBtnClick}/>
    </PrimaryBox>
</SettingsBox>