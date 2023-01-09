<script lang="ts">
import { fade } from "svelte/transition";
import { modalContent } from "../../stores/globalState";

    function closeModal(e) {
        modalContent.set(null);
    }
</script>

<svelte:window on:keydown={(e) => {if (e.key === 'Escape' && $modalContent) e.stopPropagation(); closeModal(e); }} />
{#if $modalContent}
    <div class="fixed flex flex-col justify-center items-center top-0 px-5 left-0 w-screen h-screen bg-black bg-opacity-40" on:click={closeModal} transition:fade style="z-index: 49;">
        <div class="relative text-primary p-4 bg-primary rounded-xl w-11/12 h-5/6 lg:w-4/5 lg:h-4/5 xl:w-3/5 xl:h-4/5 overflow-y-scroll" on:click|stopPropagation >
            <div class="text-right absolute right-0 transform -translate-x-full">
                <i class="lnr lnr-cross text-2xl cursor-pointer" on:click|stopPropagation={closeModal}></i>
            </div>
            <svelte:component this={$modalContent} />
        </div>
    </div>
{/if}