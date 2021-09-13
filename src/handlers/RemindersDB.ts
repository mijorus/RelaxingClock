import type { Moment } from "moment";
import { openDB, IDBPDatabase, DBSchema } from 'idb';
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

    static async get(key: number) {
        return await RemindersDB.db.get('reminders', key);
    }

    static async getAllByExpirationDate() {
        return (await RemindersDB.db.getAllFromIndex('reminders', 'at')).filter(r => {
            return (!r.done || (r.doneAt && (moment().unix() - r.doneAt < 30 * 86000)))
        })
    }

    static async remove(key: number) {
        await RemindersDB.db.delete('reminders', key)
    }

    static async setDone(key: number) {
        const reminder = await RemindersDB.db.get('reminders', key);
        RemindersDB.db.put('reminders', { ...reminder, done: true, doneAt: moment().unix() });
    }

    static async updatePending(key: number, data: Reminder) {
        const { id } = await RemindersDB.db.get('reminders', key);
        RemindersDB.db.put('reminders', { ...data, id, done: false });
    }

    static async setDueTime(key: number, at: Moment) {
        const reminder = await RemindersDB.db.get('reminders', key);
        RemindersDB.db.put('reminders', { ...reminder, at: at.unix(), done: false });
    }

    static async dbCleanUp(maxDayAge = 15) {
        const reminders = await RemindersDB.db.getAll('reminders');
        reminders.forEach(p => {
            if ( p.doneAt < ((~~(Date.now() / 1000)) - (maxDayAge * 86400)) ) RemindersDB.db.delete('reminders', p.id);
        });
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