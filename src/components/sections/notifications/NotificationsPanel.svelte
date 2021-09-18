<script lang="ts">
    import { latestNotification, notifications } from "../../../stores/notifications";
    import type { CustomNotification } from "../../../types";
    import NotificationComponent from "./CustomNotificationComponent.svelte";

    let notificationToShow: CustomNotification = null;

    $: showNotification($latestNotification)

    let timeout;
    function showNotification(n: CustomNotification) {
        clearTimeout(timeout);
        if (notificationToShow) notificationToShow = null; 
        
        if (!document.hasFocus() && Notification.permission === 'granted') {
            new Notification(n.title, {
                'silent': !n.sound,
                'body': n.content,
            });
        } else {
            notificationToShow = n;
            timeout = setTimeout(() => notificationToShow = null, 8000);
        }

        console.log('notifications', $notifications);
    }
 
</script>

<aside class="fixed right-0 bottom-0 z-40 mr-3 mb-5">
    {#if notificationToShow}
        <NotificationComponent data={notificationToShow} expire={true} />
    {/if}
</aside>