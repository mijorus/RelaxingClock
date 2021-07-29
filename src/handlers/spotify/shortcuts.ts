import { SpotifyClient } from '../../lib/spotify/SpotifyClient';
import { notifications } from '../../stores/notifications';
import { shortcuts } from '../../stores/rooster';
import { inQueue } from '../../stores/spotify';
import type { RoosterExample, RoosterExampleImageSize, RoosterExamples } from '../../types';
import { createCommaArray } from '../../utils/utils';
import { device_id } from './player';

type searchType = 'album'| 'playlist' | 'track' | 'search' | 'artist';
async function loadSearch(query: string, type: searchType): Promise<RoosterExamples> {
    let toQueue = false;

    if (!query || query.length < 2) return {};
    else if (query.endsWith(' >>')) {
        toQueue = true; query = query.replace(/>+$/g, '');
    }

    const seachTy: searchType[] = type === 'search' ? ['album', 'track', 'artist'] : [type];
    // @ts-ignore
    const res = await SpotifyClient.search(query, seachTy, { limit: type === 'search' ? 3 : 5 });
    
    let examples: RoosterExamples = {};
    console.log(res);
    
    let exampleList = [];
    for (const key of (Object.keys(res))) {
        const list: RoosterExample[] = res[key].items.map((item) => {
            let tip = ''; let size: RoosterExampleImageSize = 'sm';
            if (key === 'tracks') {
                item.artists.forEach(a => tip += ` ${a.name}`);
            }
            
            else if (key === 'artists') {
                tip = createCommaArray(item.genres ?? []);
                size = 'md';
            }
            
            else if (key === 'albums') {
                tip = `[Album${item.release_date ? (' - ' + item.release_date) : ''}]`;
            }
            
            
            const image = (key === 'tracks') ? item.album.images[item.album.images.length - 1].url : item.images[item.images.length - 1].url;
            return {'example': item.name, tip, image, 'selectable': true, 'id': (toQueue ? '>>queue<<' : '') + item.uri, size};
        });

        exampleList.push(...list);
    }
    
    examples.group = exampleList.sort((a, b) => b.size === 'md' ? 1 : -1);
    console.log(exampleList);
    examples.namespace = type;
    return examples;
}

export function createShortcuts() {
    shortcuts.set('spotify', {
        background: process.env.SPOTIFY_COLOR,
        color: process.env.BACKGROUND_DARK,
        arguments: {
            track: {
                async callback(p, id: string) {
                    try {
                        if (id.startsWith('>>queue<<')) {
                            await SpotifyClient.queue(id.replace(/^>>queue<</, ''));
                            inQueue.set(id.replace(/^>>queue<</, ''));
                        }

                        else await SpotifyClient.play({uris: [id], device_id});
                        return true;
                    } catch(err) {
                        console.log(err);
                        return false;
                    }
                }
            },
            search: {
                async callback(p, id) {
                    console.log(p, id);
                    
                    return true;
                }
            },
            playlist: {
                async callback(p) {
                    
                    return true;
                }
            },
            album: {
                async callback(p) {
                    
                    return true;
                }
            },
            pause: {
                async callback() {
                    try { await SpotifyClient.pause({device_id}); return true;}
                    catch(e) { console.error(e); return false;}
                }
            }
        }, 
        async examples(arg, params) {
            if (['search','album','playlist', 'track'].find(a => a === arg)) {
                //@ts-ignore
                return loadSearch(params, arg);
            }

            return null;
        }
    })
}
