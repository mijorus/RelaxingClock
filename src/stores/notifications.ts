import type { Readable } from "stream";
import { derived, get, writable, Writable } from "svelte/store";
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

	function dismiss(index: number) {
		if ((get(stored))[index]) {
			let spliced = (get(stored))
			spliced.splice(index, 1);
			stored.update(() => [...spliced]);
			return spliced.length;
		}
	}

	return {
		subscribe: stored.subscribe,
		create,
		dismiss,
	};
}

export const notifications = createNotification();
export const latestNotification = derived(notifications, notifications => {
    return notifications ? notifications[notifications.length - 1] : null;
});