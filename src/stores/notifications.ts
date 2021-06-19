import type { Readable } from "stream";
import { derived, writable, Writable } from "svelte/store";
import type { Notification } from "../types";

// export const notifications: Writable<Array<Notification>> = writable([]);

function createNotification() {
	const stored: Writable<Array<Notification>> = writable([]);

    function create(n: Notification) {
        stored.update(list => [...list, n]);
    }

	return {
		subscribe: stored.subscribe,
		create,
	};
}

export const notifications = createNotification();
export const latestNotification = derived(notifications, notifications => {
    return notifications ? notifications[notifications.length - 1] : null;
});