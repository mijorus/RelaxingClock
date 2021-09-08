<script lang="ts">
import { onMount } from "svelte";
import { PinnedDB } from "../../../handlers/PinnedDB";
import type { Pinned } from "../../../handlers/PinnedDB";
    
    let pinned: Pinned[] = [];


    onMount(async () => {
        await PinnedDB.initDB();
        // pinned = PinnedDB.get()
    });
</script>

<div class="h-48 transition-all border border-transparent hover:border-secondary rounded-xl m-3" style="width: 28rem;">

</div>