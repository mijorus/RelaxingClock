<script lang="ts">
    import { notifications, latestNotification } from "../../../stores/notifications";
    import type { Notification } from "../../../types";
    import NotificationComponent from "./Notification.svelte";

    let notificationToShow: Notification = null;

    $: setToShow($latestNotification)

    let timeout;
    function setToShow(n: Notification) {
        clearTimeout(timeout);
        if (notificationToShow) notificationToShow = null; 
        notificationToShow = n;
        timeout = setTimeout(() => notificationToShow = null, 8000);
    }


</script>

<aside class="fixed right-0 bottom-0 z-40 mr-3 mb-5">
    {#if notificationToShow}
        <NotificationComponent data={notificationToShow} expire={true} />
    {/if}
</aside>