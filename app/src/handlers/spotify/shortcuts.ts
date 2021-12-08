import { get, Unsubscriber } from 'svelte/store';
import { SpotifyClient } from '../../lib/spotify/SpotifyClient';
import { notifications } from '../../stores/notifications';
import { shortcuts, summoned } from '../../stores/rooster';
import { spotifyPlayerState } from '../../stores/spotify';
import type { RoosterArgument, RoosterExample, RoosterExampleImageSize, RoosterExamples, RoosterShortcut } from '../../types';
import { createCommaArray } from '../../utils/utils';
import { refershOrGetOAuthToken, device_id } from './login';
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
import { tips } from '../../stores/globalState';

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

            else if (arg.startsWith('qu')) {
                return loadQueue();
            }

            return null;
        }
    })
}

