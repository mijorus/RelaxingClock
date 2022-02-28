import type { Readable } from "stream";
import { derived, get, writable, Writable } from "svelte/store";
import type { CustomNotification } from "../types";

function createNotification() {
	const stored: Writable<CustomNotification[]> = writable([]);

    function create(n: CustomNotification) {
        n.id = Date.now();
		n.timestamp = (~~(Date.now() / 1000));
        stored.update(list => [...list, n]);

		if (Notification.permission === 'default') {
			Notification.requestPermission();
		}
    }

	function dismiss(id: number) {
        let index = undefined; 
        (get(stored)).find((n, i) => {
            if (n.id === id) {
                index = i;
                return true;
            } 

            return false; 
        });

		if (index !== undefined) {
			let spliced = (get(stored));
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