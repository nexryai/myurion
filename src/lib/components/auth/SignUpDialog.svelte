<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { Button } from "$lib/components/ui/button";

    let { isOpen = $bindable() } : {isOpen: boolean} = $props();

    let readyToSubmit = $state<boolean>(false);
    let name = $state<string>('');
    let terms = $state<boolean>(false);

    $effect(() => {
        readyToSubmit = name.length > 0 && terms;
    });


</script>

<Dialog.Root bind:open={isOpen}>
    <Dialog.Content class="sm:max-w-[500px]" escapeKeydownBehavior="ignore" interactOutsideBehavior="ignore">
        <Dialog.Header>
            <Dialog.Title>Sing Up to Goshenite</Dialog.Title>
            <Dialog.Description>
                Welcome to Goshenite! Sign up to start using the app.
            </Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="name" class="text-right">Display name</Label>
                <Input
                        id="name"
                        placeholder="Raiden"
                        class="col-span-3"
                        required
                        bind:value={name}
                />
            </div>
        </div>
        <div class="flex items-start">
            <Checkbox id="terms" bind:checked={terms}/>
            <Label for="terms" class="ml-2 text-indent-[-1.25rem] pl-5">
                I accept the software license and the following terms: THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
            </Label>
        </div>
        <Dialog.Footer>
            <Button disabled={!readyToSubmit} type="submit">Register Passkey to finish signing up</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
