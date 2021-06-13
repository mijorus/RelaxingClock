import type { Moment } from "moment";
import { openDB, deleteDB, wrap, unwrap, IDBPDatabase, DBSchema } from 'idb';


export class Reminders {
    static db: IDBPDatabase<RemindersDB>;

    static async initDB() {
        const db = await openDB<RemindersDB>('Reminders', 1, {
            upgrade(db) {
                const store = db.createObjectStore('reminders', {
                    keyPath: 'id', 
                    autoIncrement: true,
                });

                store.createIndex('at', 'at');
            },
        });

        if (!db) {
            throw 'connection to db terminated';
        }

        this.db = db;
    }

    static async create(title: string, at: Moment, data = {}) {
        return Reminders.db.add('reminders', {
            title,
            at: at.unix(),
            ...data,
        });
    }


    static getAllByExpirationDate() {
        return Reminders.db.getAllFromIndex('reminders', 'at');
    }

    static remove(key: number) {
        Reminders.db.delete('reminders', key)
    }
}

export interface RemindersDB extends DBSchema {
    reminders: {
        key: number;
        value: any;
        indexes: {
            at: number
        }
    }
}