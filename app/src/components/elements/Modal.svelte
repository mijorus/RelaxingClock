<script lang="ts">
import { fade } from "svelte/transition";
import { modalContent } from "../../stores/globalState";

    function closeModal(e) {
        modalContent.set(null);
    }
</script>

{#if $modalContent}
    <div class="fixed flex flex-col justify-center items-center top-0 px-5 left-0 w-screen h-screen bg-black bg-opacity-40" on:click={closeModal} transition:fade style="z-index: 49;">
        <div class="relative text-primary p-4 bg-primary rounded-xl w-full h-4/5 m-5 md:w-2/3 md:h-2/3" on:click|stopPropagation >
            <div class="text-right absolute right-0 transform -translate-x-full">
                <i class="lnr lnr-cross text-2xl cursor-pointer" on:click|stopPropagation={closeModal}></i>
            </div>
            <svelte:component this={$modalContent} />
        </div>
    </div>
{/if}