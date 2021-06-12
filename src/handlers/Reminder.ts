import type { Moment } from "moment";
import { openDB, deleteDB, wrap, unwrap, IDBPDatabase, DBSchema } from 'idb';


export class Reminders {
    static db: IDBPDatabase<RemindersDB>;

    static async initDB() {
        this.db = await openDB<RemindersDB>('Reminders', 1, {
            upgrade(db) {
                const store = db.createObjectStore('reminders', {
                    keyPath: 'id', 
                    autoIncrement: true,
                });

                store.createIndex('at', 'at');
            },

            terminated() {
                throw 'connection to db terminated';
            }
        });
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