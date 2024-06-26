import { get, Unsubscriber } from 'svelte/store';
import { SpotifyClient } from '../../lib/spotify/SpotifyClient';
import { notifications } from '../../stores/notifications';
import { shortcuts, summoned } from '../../stores/rooster';
import { spotifyPlayerState } from '../../stores/spotify';
import type { InjectRoosterActionEvent, RoosterActionType, RoosterArgument, RoosterExample, RoosterExampleImageSize, RoosterExamples, RoosterShortcut } from '../../types';
import { createCommaArray } from '../../utils/utils';
import { refershOrGetOAuthToken, device_id } from './login';
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
import { tips } from '../../stores/globalState';
import { emit } from 'cluster';
import { pulse } from '../../components/sections/FloatingBlobs/flobs';

momentDurationFormatSetup(moment);

type searchType = 'album'| 'playlist' | 'track' | 'search' | 'artist';

async function loadSearch(query: string, type: searchType): Promise<RoosterExamples> {
    let toQueue: boolean | string = false; 
    let res: SpotifyApi.SearchResponse | void;

    if (!query || query.length < 2) return {};

    const seachTy: any[] = type === 'search' ? ['album', 'track', 'artist'] : [type];
    // @ts-ignore
    if (!res) {
        res = await SpotifyClient.search(query, seachTy, { limit: type === 'search' ? 4 : 8 })
            .catch((e) => { if (e.status === 401) refershOrGetOAuthToken() });
    }

    let examples: RoosterExamples = {};
    if (!res) return examples; //return immediately if no result was found
    
    let exampleList = [];
    for (const key of (Object.keys(res))) {
        let mostPopularArtist: string;
        if (key === 'artists') {
            res.artists.items.sort((a, b) => b.popularity - a.popularity);
            mostPopularArtist = res.artists.items[0].uri;
        }

        if (res[key]?.items[0]?.popularity) res[key].items = res[key].items.sort((a, b) =>  b.popularity > a.popularity);

        const list: RoosterExample[] = res[key].items.map((item) => {
            let tip = ''; let size: RoosterExampleImageSize = 'sm';
            if (key === 'tracks') {
                tip += item.explicit ? '[E] ' : ' ';
                tip += createCommaArray(item.artists.map(a => a.name));
                //@ts-ignore
                tip += ' · '+ moment.duration(item.duration_ms, 'milliseconds').format('mm:ss', { trim: false })
            }
            
            else if (key === 'artists') {
                tip = '[Artist' + (mostPopularArtist === item.uri ? ', most popular' : '')+ ']';
                size = mostPopularArtist === item.uri ? 'md' : 'sm';
            }
            
            else if (key === 'albums') {
                tip = `[Album${item.release_date ? (' - ' + item.release_date) : ''}]`;
            }

            else if (key === 'playlists') {
                if (item?.owner?.display_name) tip = 'by ' + item?.owner?.display_name;
            }
            
            const images =  item?.album?.images ? item.album.images : item.images;
            const image = images.length ? images[images.length - 1].url : '';
            return {
                'example': item.name, 
                tip, 
                image, 
                'selectable': true, 
                'id': (toQueue !== false ? `${toQueue}>>${item.name}<<` : '') + item.uri, 
                size, 
                sortingKey: item.popularity
            };
        });

        exampleList.push(...list);
    }
    
    examples.group = exampleList;
    examples.namespace = type;
    examples.tips = {'0': 'Play', '1': 'Add to queue', '2': 'Play but keeps the queue'};

    return examples;
}

async function loadQueue(): Promise<RoosterExamples> {
    const playerState = get(spotifyPlayerState);
    if (playerState.track_window?.next_tracks.length) {
        return {
            'namespace': 'Queue',
            'group': playerState.track_window.next_tracks.map((el, i) => {
                return {
                    'argument': '#' + (i + 1).toString(),
                    'example': el.name,
                    'selectable': false,
                    'size': 'sm',
                    'image': el?.album?.images[0]?.url || '',
                }
            })
        }
    } else {
        return {'group': [], 'namespace': 'Queue'};
    }
}

async function loadPodcastSearch(query: string): Promise<RoosterExamples> {
    if (!query || query.length < 2) return {};
    const { shows } = await SpotifyClient.searchShows(query, { limit: 10 });
    console.log(shows);

    let group: RoosterExample[] = [];
    for (let i = 0; i < shows.items.length; i++) {
        const show = shows.items[i];
        group.push({
            example: show.name, 
            //@ts-ignore
            tip: `${show.explicit ? '[E]' : ''} ${show.publisher} - ${show.total_episodes ? `${show.total_episodes} episodes` : ''}`, 
            image: show.images[0].url, 
            id: show.id,
            selectable: true, 
            size: 'sm', 
            sortingKey: (-i)
        });
    }

    const examples:RoosterExamples = {namespace: 'Podcasts', group, tips: {0: 'Play', 1: 'Select an episode'}};
    return examples;
}

let selectedShowId = '';
let lastLoadedEpisodes: SpotifyApi.ShowEpisodesResponse;
let lastLoadedShow: SpotifyApi.SingleShowResponse;
async function loadEpisodeSearch(q: string = undefined): Promise<RoosterExamples> {
    if (!selectedShowId.length) return {};

    if (!lastLoadedShow || lastLoadedShow.id !== selectedShowId || !lastLoadedEpisodes) {
        lastLoadedShow = await SpotifyClient.getShow(selectedShowId);
        lastLoadedEpisodes  = await SpotifyClient.getShowEpisodes(selectedShowId, { limit: 50, q});
    }

    let episodes = [];
    if (q) {
        q = q.trim();
        episodes = lastLoadedEpisodes.items.filter(ep => ep.name.match(new RegExp(q, 'i')) );
    } else {
        episodes = lastLoadedEpisodes.items;
    }


    let group: RoosterExample[] = [];
    for (let i = 0; i < (episodes.length > 20 ? 20 : episodes.length); i++) {
        const episode = episodes[i];
        group.push({
            example: episode.name, 
            //@ts-ignore
            tip: `${episode.explicit ? '[E]' : ''} ${lastLoadedShow.publisher} - ${moment.duration(episode.duration_ms).format('mm:ss', {trim: false})} - ${episode.release_date}`, 
            image: episode.images[0].url, 
            id: episode.uri,
            selectable: true, 
            size: 'sm', 
            sortingKey: (-i),
        });
    }

    const examples:RoosterExamples = {namespace: 'Episodes of ' + lastLoadedShow.name, group, tips: {0: 'Play'}};
    return examples;
}

export function createShortcuts() {
    let args: {[key: string]: RoosterArgument} = {};
    ['search','album','playlist', 'track'].forEach(el => {
        args[el] = {
            description: `Search for  ${el === 'search' ? 'everything' : el} on Spotify`,
            async callback(p, id: string, action) {
                try {
                    const skipToQueue = (action === 2);
                    const isQueue = action;
                    
                    if (isQueue) {
                        await SpotifyClient.queue(id);
                        let exampleEl = undefined;

                        try { exampleEl = document.querySelector(`[data-id='example-${id}']`) } 
                        catch (e) { console.error(e) }

                        if (!skipToQueue) notifications.create({'title': 'Added to queue', 'content': exampleEl ? exampleEl.textContent : '', 'icon': 'fab fa-spotify'});
                        else await SpotifyClient.skipToNext();
                    } else {
                        let params: SpotifyApi.PlayParameterObject = {device_id};
                        id.match("spotify:track:") ? params.uris = [id] : params.context_uri = id; 
                        await SpotifyClient.play(params);
                        pulse(1);
                    }
                    
                    return true;
                } catch(err) {
                    console.log(err);
                    return false;
                }
            }
        }
    });

    args.search.quickLaunch = 'l';
    args.playlist.quickLaunch = 'm';
    args.track.quickLaunch = 't';

    shortcuts.set('spotify', {
        background: process.env.SPOTIFY_COLOR,
        color: process.env.BACKGROUND_DARK,
        arguments: {
            ...args,
            podcast: {
                quickLaunch: 'n',
                description: 'Search for a podcast',
                async callback(p: string, id: string, action: RoosterActionType) {
                    if (action === 1) {
                        selectedShowId = id;
                        const e: InjectRoosterActionEvent = new CustomEvent('injectRoosterAction', {detail: {'command': 'spotify', 'argument': 'podcast ->'}})
                        
                        window.dispatchEvent(e);
                        document.getElementById('rooster-argument').dispatchEvent(new KeyboardEvent('keydown', {'key': ' '}));

                        return false;
                    }

                    const lastShow = await SpotifyClient.getShowEpisodes(id, {'limit': 1 });
                    await SpotifyClient.play({'uris': [lastShow.items[0].uri], device_id});
                    return true;
                },
            },
            'podcast ->': {
                active: selectedShowId.length > 0,
                hideInModal: true,
                async callback(p: string, id: string, action: RoosterActionType) {
                    await SpotifyClient.play({uris: [id], device_id});
                    return true;
                },
            },
            pause: {
                description: '[or press Space]',
                async callback() {
                    try { await SpotifyClient.pause({device_id}); return true;}
                    catch(e) { console.error(e); return false;}
                }
            },
            queue: {
                description: 'Shows the incoming tracks',
                async callback() {
                    return false;
                }
            }
        }, 
        async examples(arg, params) {
            if (['search','album','playlist', 'track'].find(a => a === arg)) {
                //@ts-ignore
                return loadSearch(params, arg);
            }

            else if (arg === 'podcast') {
                //@ts-ignore
                return loadPodcastSearch(params);
            }

            else if (arg === 'podcast ->') {
                //@ts-ignore
                console.log(selectedShowId);
                return loadEpisodeSearch(params);
            }

            else if (arg.startsWith('qu')) {
                return loadQueue();
            }

            if (arg !== 'podcast ->') {
                selectedShowId = '';
            }

            return null;
        }
    })
}

