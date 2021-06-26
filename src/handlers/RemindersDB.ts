import type { Moment } from "moment";
import { openDB, deleteDB, wrap, unwrap, IDBPDatabase, DBSchema } from 'idb';
import type { Reminder, StoredReminder } from "../types";
import moment from "moment";


export class RemindersDB {
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

    static async create(reminder: Reminder) {
        return RemindersDB.db.add('reminders', reminder);
    }


    static async getAllByExpirationDate() {
        return (await RemindersDB.db.getAllFromIndex('reminders', 'at')).filter(r => {
            return (!r.done || (r.doneAt && (moment().unix() - r.doneAt < 30 * 86000)))
        })
    }

    static remove(key: number) {
        RemindersDB.db.delete('reminders', key)
    }

    static async setDone(key: number) {
        const reminder = await RemindersDB.db.get('reminders', key);
        RemindersDB.db.put('reminders', { ...reminder, done: true, doneAt: moment().unix() });
    }

    static async setDueTime(key: number, at: Moment) {
        const reminder = await RemindersDB.db.get('reminders', key);
        RemindersDB.db.put('reminders', { ...reminder, done: true, at: at.unix() });
    }
}

export interface RemindersDB extends DBSchema {
    reminders: {
        key: number;
        value: StoredReminder;
        indexes: {
            at: number
        }
    }
}