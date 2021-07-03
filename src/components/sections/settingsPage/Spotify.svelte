<script lang="ts">
    import SettingsBox from '../../elements/SettingsBox.svelte';
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import Action from "../../elements/settings/Buttons/Action.svelte";
    import { spotifyPlayerStatus, spotifyUrl, spotifyUserData } from '../../../stores/spotify';
    import { logout } from '../../../handlers/spotify/login';
import type { SpotifyPlayerStatus } from '../../../types';

    let boxLabel: string;
    $: changeStatus($spotifyPlayerStatus, $spotifyUserData);

    function changeStatus(spotifyPlayerStatus: SpotifyPlayerStatus, spotifyUserData: SpotifyApi.CurrentUsersProfileResponse) {
        console.log(spotifyPlayerStatus, spotifyUserData);
        
        switch(spotifyPlayerStatus) {
            case 'disconnected':
                boxLabel = 'Login with Spotify';
                break;
            case 'connecting':
                boxLabel = 'Connecting...';
                break;
            case 'ready':
                if (spotifyUserData) {
                    boxLabel = 'Logged in as ' + spotifyUserData.display_name;
                }
                break;
            case 'expired':
                boxLabel = 'Sorry, but you need to login again :(';
                break;
            case 'non-premium':
                boxLabel = 'Sorry, but you need a premium subscription in order to user third-party players :(';
                break;
            case 'error':
                boxLabel = 'Error!';
                break;
        }
    }



    function handleBtnClick() {
        if ($spotifyUrl) {
            window.location.replace($spotifyUrl)
        }  else {
            logout();
            window.location.reload();
        };
    }
</script>

<SettingsBox>
    <Title title="Spotify">
        <TitleIcon>
            <i class="fab fa-spotify settings-title-icon text-spotify text-7xl transform -translate-y-2"></i>
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