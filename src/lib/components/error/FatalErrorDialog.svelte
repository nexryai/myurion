<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { CircleX } from "lucide-svelte";

    let {
        isOpen = $bindable(),
        errorDetails = $bindable()
    } : {isOpen: boolean, errorDetails?: string} = $props();

</script>

<Dialog.Root bind:open={isOpen}>
    <Dialog.Content class="w-full" escapeKeydownBehavior="ignore" interactOutsideBehavior="ignore" showCloseButton={false}>
        <Dialog.Header>
            <Dialog.Title class="flex text-red-600" >
                <CircleX /> <span class="pt-0.5 pl-1.5">Unrecoverable Error</span>
            </Dialog.Title>
            <Dialog.Description>
                An fatal error occurred. Please try these steps and if the problem persists, open an issue on GitHub.
            </Dialog.Description>
        </Dialog.Header>
        <div class="text-center w-full">
            <ul class="text-left list-disc w-[300px] m-auto">
                <li>Check your internet connection</li>
                <li>Check server side logs</li>
                <li>Clear your browser and DNS cache</li>
            </ul>
        </div>
        <div class="text-center">
            <p>Technical details: <code class="text-gray-500">{errorDetails || "UNKNOWN"}</code></p>
        </div>
    </Dialog.Content>
</Dialog.Root>
