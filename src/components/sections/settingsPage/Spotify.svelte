<script lang="ts">
import SettingsBox from '../../elements/SettingsBox.svelte';
import Title from "../../elements/settings/Title.svelte";
import TitleIcon from "../../elements/settings/TitleIcon.svelte";
import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
import Action from "../../elements/settings/Buttons/Action.svelte";
import { spotifyPlayerStatus, spotifyUrl, spotifyUserData } from '../../../stores/spotify';
import { logout } from '../../../handlers/spotify/login';
import type { SpotifyPlayerStatus } from '../../../types';
import NestedBox from '../../elements/settings/NestedBox.svelte';
import { SpotifyClient } from '../../../lib/spotify/SpotifyClient';
import { fade, slide } from 'svelte/transition';
import SpotifyWebApi from 'spotify-web-api-js';
import Checkbox from '../../elements/settings/Buttons/Checkbox.svelte';
import Booleans from '../../elements/settings/Buttons/Booleans.svelte';

    let boxLabel: string;
    let favLocationExp = false;
    let moreP = false;
    $: changeStatus($spotifyPlayerStatus, $spotifyUserData);
    let featuredPlaylists: SpotifyApi.ListOfFeaturedPlaylistsResponse;
    let myPlaylists: SpotifyApi.ListOfCurrentUsersPlaylistsResponse;
    
    async function handlePlaylistBox() {
        if (!featuredPlaylists) {
            featuredPlaylists = await SpotifyClient.getFeaturedPlaylists({'country': $spotifyUserData.country, 'limit': 16});
            myPlaylists = await SpotifyClient.getUserPlaylists($spotifyUserData.id, {'limit': 10});
            console.log(myPlaylists);
            
        } else {
            moreP = false;
        }
    }

    function changeStatus(spotifyPlayerStatus: SpotifyPlayerStatus, spotifyUserData: SpotifyApi.CurrentUsersProfileResponse) {
        switch(spotifyPlayerStatus) {
            case 'disconnected':
                boxLabel = 'Login with Spotify';
                break;
            case 'connecting':
                boxLabel = 'Connecting...';
                break;
            case 'ready':
                if (spotifyUserData) boxLabel = 'Logged in as ' + spotifyUserData.display_name;
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
        }
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
    {#if $spotifyPlayerStatus === 'ready'}
        <div class="flex justify-end" transition:slide>
            <NestedBox expandable label="Playlists for you" bordered={false} on:click={handlePlaylistBox}>
                {#if !featuredPlaylists || !myPlaylists}
                  <div class="loader text-center transform scale-75">
                      <div class="line-scale"><div></div><div></div><div></div><div></div><div></div></div></div>
                {:else}  
                    <div class="max-h-96 mt-2 overflow-y-scroll w-full" transition:fade>
                        <div class="w-full text-center font-bold w pt-3">From your library</div>
                        {#each myPlaylists.items as m}
                            <div class="bg-tertiary rounded-lg my-1 p-2 overflow-x-hidden whitespace-nowrap flex">
                                <img src={m.images[0].url} alt={m.name} class="inline-block w-14 rounded-md">
                                <div class="flex flex-col justify-center ml-2">
                                    <div>{m.name}</div>
                                    <div class="text-secondary">by {m.owner.display_name}</div>
                                </div>
                            </div>
                        {/each}
                        <div class="w-full text-center font-bold w pt-3">Featured</div>
                        {#each featuredPlaylists.playlists.items as p, index}
                            <div class="bg-tertiary rounded-lg my-1 p-2 overflow-x-hidden whitespace-nowrap flex" class:hidden={(index > 8 && !moreP)}>
                                <img src={p.images[0].url} alt={p.name} class="inline-block w-14 rounded-md">
                                <div class="flex flex-col justify-center ml-2">
                                    <div>{p.name}</div>
                                    <div class="text-secondary">{p.description}</div>
                                </div>
                            </div>
                        {/each}
                        {#if !moreP}
                            <div class="text-center cursor-pointer text-sm underline" on:click={() => {moreP = true}}>Load more</div>
                        {/if}
                    </div>
                {/if }
            </NestedBox>
        </div>
    {/if}
    <NestedBox label="Save in a separate playlist" 
        bordered={true} 
        available={$spotifyPlayerStatus === 'ready'}
        description="Whether to save songs that you like in your library on in Relaxing Clock's playlist"
    >
        <Booleans state={false} label={'save in user library'}/>
    </NestedBox>
</SettingsBox>