<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Button } from "$lib/components/ui/button";
    import SelectIcon from "$lib/components/icons/SelectIcon.svelte";
    import { callApi } from "$lib/browser/api";

    let { isOpen = $bindable() } : {isOpen: boolean} = $props();

    let readyToSubmit = $state<boolean>(false);
    let name = $state<string>('');
    let icon = $state<string>('');

    $effect(() => {
        readyToSubmit = name.length > 0 && icon !== '';
    });

    async function create() {
        if (!readyToSubmit) {
            return;
        }

        const response = await callApi<{ id :string }>('/api/note/create-category', 'POST', {
            name,
            iconName: icon,
        });

        if (response.id) {
            isOpen = false;
        }
    }
</script>

<Dialog.Root bind:open={isOpen}>
    <Dialog.Content class="sm:max-w-[500px]">
        <Dialog.Header>
            <Dialog.Title>Add category</Dialog.Title>
            <Dialog.Description>
                Add a new category to store your notes.
            </Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="name" class="text-right">Category name</Label>
                <Input
                        id="name"
                        placeholder="Personal"
                        class="col-span-3"
                        required
                        bind:value={name}
                />
                <Label for="name" class="text-right">Icon</Label>
                <SelectIcon bind:selected={icon}/>
            </div>
        </div>
        <Dialog.Footer>
            <Button
                    disabled={!readyToSubmit}
                    type="submit"
                    onclick={() => {create()}}
            >
                Create
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
