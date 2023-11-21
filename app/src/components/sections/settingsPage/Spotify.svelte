<script lang="ts">
    import SettingsBox from "../../elements/SettingsBox.svelte";
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import Action from "../../elements/settings/Buttons/Action.svelte";
    import {
        nextSpotifySongEnd,
        spotifyPlayerState,
        spotifyPlayerStatus,
        spotifyUrl,
        spotifyUserData,
    } from "../../../stores/spotify";
    import { logout } from "../../../handlers/spotify/login";
    import type { SpotifyPlayerStatus } from "../../../types";
    import NestedBox from "../../elements/settings/NestedBox.svelte";
    import { fade, slide } from "svelte/transition";
    import Booleans from "../../elements/settings/Buttons/Booleans.svelte";
    import AnimatedText from "../../elements/AnimatedText.svelte";
    import { SpotifyClient } from "../../../lib/spotify/SpotifyClient";
    import { device_id } from "../../../handlers/spotify/login";
    import { contextHistory, saveTracksInCustomPlaylist } from "../../../stores/storedSettings";
    import moment, { Moment } from "moment";
    import time from "../../../stores/time";
    import { createIncomingEvent } from "../../clock/IncomingEventsMessages.svelte";

    $: changeStatus($spotifyPlayerStatus, $spotifyUserData);
    $: periodicCheck($time);

    let boxLabel: string;
    let moreP = false;
    let featuredPlaylists: SpotifyApi.ListOfFeaturedPlaylistsResponse;
    let myPlaylists: SpotifyApi.ListOfCurrentUsersPlaylistsResponse;
    let firstTimeReady = false;
    let showLastPlayedBox = false;
    let shownIncomingSpotifySongId: string = null;

    function periodicCheck(time: Moment) {
        if (time.unix() % 3 !== 0) return;

        const nextIdSong = $spotifyPlayerState?.track_window?.next_tracks[0]?.id;
        if (!nextIdSong) return;

        const incomingSeconds = 25;
        const timeLeftToNext = $nextSpotifySongEnd - Date.now();

        if (timeLeftToNext < incomingSeconds * 1000 && nextIdSong !== shownIncomingSpotifySongId) {
            console.log("next Song incoming");
            createIncomingEvent({
                icon: "fab fa-spotify",
                text: "Next song · " + $spotifyPlayerState.track_window.next_tracks[0].name,
            });
            shownIncomingSpotifySongId = nextIdSong;
        }
    }

    async function handlePlaylistBox() {
        if (!featuredPlaylists) {
            featuredPlaylists = await SpotifyClient.getFeaturedPlaylists({
                country: $spotifyUserData.country,
                limit: 20,
            });
            myPlaylists = await SpotifyClient.getUserPlaylists($spotifyUserData.id, { limit: 10 });
        } else {
            moreP = false;
        }
    }

    async function checkLastPlayedTrack(lastPlayerTheshold = 15) {
        if (localStorage.getItem("lastPlayedTrack") && device_id) {
            const lastPlayedTrackSplit = localStorage.getItem("lastPlayedTrack").split("::", 2);

            if (Date.now() - parseInt(lastPlayedTrackSplit[0]) < lastPlayerTheshold * 1000) {
                SpotifyClient.play({ device_id, uris: [lastPlayedTrackSplit[1]] });
            }
        }
    }

    function changeStatus(
        spotifyPlayerStatus: SpotifyPlayerStatus,
        spotifyUserData: SpotifyApi.CurrentUsersProfileResponse
    ) {
        switch (spotifyPlayerStatus) {
            case "disconnected":
                boxLabel = "Login with Spotify";
                break;
            case "waiting_interaction":
                boxLabel = "Tap anywhere to enable Spotify";
                break;
            case "connecting":
                boxLabel = "Connecting...";
                break;
            case "ready":
                console.log(spotifyPlayerStatus, spotifyUserData?.display_name);
                if (spotifyUserData)
                    boxLabel = "Logged in as " + spotifyUserData.display_name + " 😊";
                break;
            case "expired":
                boxLabel =
                    "Sorry, but your session might have expired ☹️. Please try to login again.";
                break;
            case "non-premium":
                boxLabel =
                    "Sorry, but you need a premium subscription in order to use third-party players ☹";
                break;
            case "access_denied":
                boxLabel = "✋🏿 Access denied!";
                break;
            case "error":
                boxLabel = "😔 Unknown error, please try to logout and login again";
                break;
        }

        if (spotifyPlayerStatus === "ready" && !firstTimeReady) {
            firstTimeReady = true;
            checkLastPlayedTrack();
        }
    }

    function handleBtnClick() {
        if ($spotifyUrl) {
            window.location.replace($spotifyUrl);
        } else {
            logout();
            window.location.replace("/");
        }
    }
</script>

<SettingsBox id="spotify" collapsable={false}>
    <Title title="Spotify">
        <TitleIcon>
            <i
                class="fab fa-spotify settings-title-icon text-spotify text-5xl md:text-7xl transform -translate-y-2"
            />
        </TitleIcon>
    </Title>
    <PrimaryBox label={{ text: boxLabel }} description={{ text: "" }} available={true}>
        <Action label={$spotifyUrl ? "Login" : "Logout"} on:click={handleBtnClick} />
    </PrimaryBox>
    <NestedBox
        label="Search tracks, albums and more!"
        available={$spotifyPlayerStatus === "ready"}
        description="Search was moved to the command box!"
    >
        <!-- svelte-ignore missing-declaration -->
        <Action
            label="Open"
            on:click={() =>
                window.dispatchEvent(
                    new CustomEvent("injectRoosterAction", {
                        detail: { command: "spotify", argument: "search" },
                    })
                )}
        />
    </NestedBox>
    {#if $spotifyPlayerStatus === "ready"}
        <div class="flex justify-end" transition:slide>
            <NestedBox
                expandable
                label="Playlists for you"
                bordered={false}
                on:click={handlePlaylistBox}
            >
                {#if !featuredPlaylists || !myPlaylists}
                    <div class="loader text-center transform scale-50">
                        <div class="line-scale">
                            <div />
                            <div />
                            <div />
                            <div />
                            <div />
                        </div>
                    </div>
                {:else}
                    <div
                        class="mt-2 overflow-y-scroll w-full relative"
                        style="max-height: 32rem;"
                        transition:fade
                    >
                        <div
                            class="w-full text-center font-bold w py-1 sticky top-0 z-0 bg-secondary"
                        >
                            From your library
                        </div>
                        {#each myPlaylists.items as m}
                            <div
                                class="bg-tertiary rounded-lg my-1 p-2 overflow-x-hidden whitespace-nowrap flex cursor-pointer"
                                on:click={() => {
                                    if (SpotifyClient)
                                        SpotifyClient.play({ context_uri: m.uri, device_id });
                                }}
                            >
                                <img
                                    src={m.images[0].url}
                                    alt={m.name}
                                    class="inline-block w-14 rounded-md"
                                />
                                <div class="flex flex-col justify-center ml-2">
                                    <div>{m.name}</div>
                                    <div class="text-secondary">by {m.owner.display_name}</div>
                                </div>
                            </div>
                        {/each}
                        <div
                            class="w-full text-center font-bold w py-1 sticky top-0 z-10 bg-secondary"
                        >
                            Featured
                        </div>
                        <div class="relative z-0">
                            {#each featuredPlaylists.playlists.items as p, index}
                                <div
                                    class="bg-tertiary rounded-lg my-1 p-2 max-w-full overflow-x-hidden whitespace-nowrap flex cursor-pointer"
                                    class:hidden={index > 8 && !moreP}
                                    on:click={() => {
                                        if (SpotifyClient)
                                            SpotifyClient.play({ context_uri: p.uri, device_id });
                                    }}
                                >
                                    <img
                                        src={p.images[0].url}
                                        alt={p.name}
                                        class="inline-block w-14 rounded-md z-10"
                                    />
                                    <div class="flex flex-col justify-center ml-2 max-w-full">
                                        <div><AnimatedText text={p.name} /></div>
                                        <div class="text-secondary text-xs">
                                            <AnimatedText text={p.description} />
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                        {#if !moreP}
                            <div
                                class="text-center cursor-pointer text-sm underline"
                                on:click={() => {
                                    moreP = true;
                                }}
                            >
                                Load more
                            </div>
                        {/if}
                    </div>
                {/if}
            </NestedBox>
        </div>
        <div class="flex justify-end" transition:slide>
            <NestedBox
                expandable
                label="Last played in Relaxing Clock"
                bordered={false}
                on:click={() => (showLastPlayedBox = !showLastPlayedBox)}
                available={$contextHistory.length > 0}
            >
                <div
                    class="mt-2 overflow-y-scroll w-full relative"
                    style="max-height: 32rem;"
                    transition:fade
                >
                    {#each $contextHistory as h (h.uri)}
                        {#if h.name}
                            <div
                                class="bg-tertiary rounded-lg my-1 p-2 overflow-x-hidden whitespace-nowrap flex cursor-pointer"
                                on:click={() => {
                                    if (SpotifyClient)
                                        SpotifyClient.play({ context_uri: h.uri, device_id });
                                }}
                            >
                                <div class="flex flex-col justify-center ml-2">
                                    <div>{h.name}</div>
                                    <div class="text-secondary">
                                        {moment(h.date, "x").fromNow()}
                                    </div>
                                </div>
                            </div>
                        {/if}
                    {/each}
                </div>
            </NestedBox>
        </div>
    {/if}
    <!-- <NestedBox label="Save in a separate playlist" 
        bordered={true} 
        available={$spotifyPlayerStatus === 'ready'}
        description="Whether to save songs that you like in your library on in Relaxing Clock's playlist"
    >
        <Booleans state={$saveTracksInCustomPlaylist} on:change={(e) => saveTracksInCustomPlaylist.set(e.detail)} label={'save in custom playlist'}/>
    </NestedBox> -->
</SettingsBox>
