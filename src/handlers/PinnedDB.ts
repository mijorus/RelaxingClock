import { openDB, IDBPDatabase, DBSchema } from 'idb';

export interface Pinned {
    title: string;
    createdAt: number;
    done: boolean;
    doneAt: number;
}

interface StoredPinned extends Pinned {
    id?: number;
}

export interface PinnedDB extends DBSchema {
    pinned: {
        key: number;
        value: StoredPinned;
        indexes: {
            createdAt: number
        }
    }
}

export class PinnedDB {
    static db: IDBPDatabase<PinnedDB>;

    static async initDB() {
        const db = await openDB<PinnedDB>('Pinned', 1, {
            upgrade(db) {
                const store = db.createObjectStore('pinned', {
                    keyPath: 'id', 
                    autoIncrement: true,
                });

                store.createIndex('createdAt', 'at');
            },
        });

        if (!db) {
            throw 'connection to db terminated';
        }

        this.db = db;
    }

    static async create(reminder: Pinned) {
        return PinnedDB.db.add('pinned', { ...reminder, createdAt: (~~Date.now() / 1000)});
    }

    static async get(key: number) {
        return await PinnedDB.db.get('pinned', key);
    }

    static async getAllActive() {
        return (await PinnedDB.db.getAll('pinned')).filter(p => {
            return !p.done;
        });
    }

    static async remove(key: number) {
        await PinnedDB.db.delete('pinned', key)
    }

    static async setDone(key: number) {
        const reminder = await PinnedDB.db.get('pinned', key);
        PinnedDB.db.put('pinned', { ...reminder, done: true, doneAt: (~~Date.now() / 1000) });
    }
}