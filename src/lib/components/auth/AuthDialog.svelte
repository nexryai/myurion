<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import PasskeyIcon from "$lib/icons/passkey52.svg";

    let { isOpen = $bindable() } : {isOpen: boolean} = $props();

</script>

<Dialog.Root bind:open={isOpen}>
    <Dialog.Content class="sm:max-w-[425px]" escapeKeydownBehavior="ignore" interactOutsideBehavior="ignore" showCloseButton={false}>
        <Dialog.Header>
            <Dialog.Title>Authentication Required</Dialog.Title>
            <Dialog.Description>
                To protect your data, please re-authenticate with Passkey to continue.
            </Dialog.Description>
        </Dialog.Header>
        <div class="text-center w-full">
            <img alt="passkey icon" class="mx-auto my-4" src={PasskeyIcon} />
        </div>
        <div class="text-center">
            <p>Waiting for Passkey authentication...</p>
        </div>
    </Dialog.Content>
</Dialog.Root>
