import type { Readable } from "stream";
import { derived, writable, Writable } from "svelte/store";
import type { CustomNotification } from "../types";

function createNotification() {
	const stored: Writable<CustomNotification[]> = writable([]);

    function create(n: CustomNotification) {
		n.timestamp = (~~(Date.now() / 1000));
        stored.update(list => [...list, n]);

		if (Notification.permission === 'default') {
			Notification.requestPermission();
		}
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