<script lang="ts">
    import { notifications, latestNotification } from "../../../stores/notifications";
    import type { Notification } from "../../../types";
    import NotificationComponent from "./Notification.svelte";

    let notificationToShow: Notification = null;

    $: setToShow($latestNotification)

    function setToShow(n: Notification) {
        if (notificationToShow) notificationToShow = null; 
        notificationToShow = n;
        const timeout = setTimeout(() => notificationToShow = null, 4000);
    }
</script>

<aside class="fixed right-0 bottom-0 z-40 mr-3 mb-5">
    {#if notificationToShow}
        <NotificationComponent data={notificationToShow} expire={true} />
    {/if}

    {#if false}
        {#each $notifications as notification}
            <NotificationComponent data={notification} />
        {/each}
    {/if}
</aside>