<script lang="ts">
    import { Trigger as SidebarTrigger } from "$lib/components/ui/sidebar/index.js";
    import ShadEditor from '$lib/components/shad-editor/shad-editor.svelte';
    import type { Content } from "@tiptap/core";
    import { callApi } from "$lib/browser/api";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { allowUnload, preventUnload } from "$lib/browser/lock";
    import { toast } from "svelte-sonner";
    import { ChevronDown, CloudAlert, Trash2, Undo2 } from "lucide-svelte";
    import { browser } from "$app/environment";
    import { Button } from "$lib/components/ui/button";
    import { IconFileTextSpark } from "@tabler/icons-svelte";
    import { type NoteCategory } from "@prisma/client";
    import RenderIcon from "$lib/components/icons/RenderIcon.svelte";
    import { Input } from "$lib/components/ui/input";
    import { onDestroy } from "svelte";
    import { goto } from "$app/navigation";

    // Props
    let {
        title,
        noteId
    }: {
        title: string | null;
        noteId: string | null;
    } = $props();

    const noteEndpoint = noteId ? `/api/note/${noteId}` : "/api/me/quick-note";
    let timer: number | null = null;

    // States
    let noteTitle = $state(title ?? "Loading...");
    let statusText = $state('saved');
    let connectionIsLost = $state(false);
    let publishTitle = $state('Untitled');
    let deleteConfirmDialogIsOpen = $state(false);

    const fetchContent = async () => {
        try {
            const response = await callApi(noteEndpoint, "GET") as unknown as { title?: string, content: string };
            noteTitle = noteId ? response.title ?? "Untitled" : "Quick Note";
            return response.content ? JSON.parse(response.content) as Content : "Start writing...";
        } catch (error) {
            console.error(error);
            return '';
        }
    };

    const fetchNoteCategories = async () => {
        const response = await callApi("/api/note/categories", "GET");
        return response as NoteCategory[];
    };

    const onChanged = (content: Content) => {
        preventUnload();
        statusText = 'saving...';

        if (timer) {
            window.clearTimeout(timer);
        }

        timer = window.setTimeout(() => {
            const request = noteId ? {
                "title" : noteTitle,
                "content" : JSON.stringify(content)
            }: {
                "content" : JSON.stringify(content)
            };

            callApi(noteEndpoint, "PUT", request).catch(error => {
                console.error("Failed to save content", error);
                toast.error('Failed to save content');
                connectionIsLost = true;
                statusText = 'NOT SAVED - ERROR';
            }).then(() => {
                statusText = 'saved';
                allowUnload();
            });
        }, 1000);
    };

    const publish = async (categoryId: string) => {
        if (!publishTitle) {
            toast.error('Title is required');
            return;
        }

        const response = await callApi("/api/me/promote-quick-note", "POST", {
            title: publishTitle,
            categoryId,
        }) as unknown as { created: string };

        if (response.created) {
            toast.success('Published');
        } else {
            toast.error('Failed to publish');
        }
    };

    const deleteNote = async () => {
        const response = await callApi(noteEndpoint, "DELETE") as unknown as { ok: boolean };

        if (response.ok) {
            toast.success('Deleted');
            await goto('/');
        } else {
            toast.error('Failed to delete');
        }
    };

    onDestroy(() => {
        if (timer) {
            window.clearTimeout(timer);
        }
    });
</script>

<header class="flex h-12 items-center justify-between px-4">
    <SidebarTrigger />
    <div class="flex">
        {#if connectionIsLost}
            <CloudAlert class="text-red-600" />
            <p class="animate-pulse ml-4 text-red-600">CONNECTION LOST - Not saved</p>
        {:else }
            {#if !noteId}
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button class="h-6" variant="outline">
                            <IconFileTextSpark />
                            Publish
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content class="w-64">
                        <DropdownMenu.Group>
                            <DropdownMenu.GroupHeading>Title</DropdownMenu.GroupHeading>
                            <DropdownMenu.Separator />
                            <Input class="mx-auto mt-4 mb-5 w-48" bind:value={publishTitle} />
                        </DropdownMenu.Group>
                        <DropdownMenu.Group>
                            <DropdownMenu.GroupHeading>Publish to...</DropdownMenu.GroupHeading>
                            <DropdownMenu.Separator />
                            {#await fetchNoteCategories()}
                                <Skeleton class="h-4 w-[64px]" />
                            {:then categories}
                                {#each categories as category}
                                    <DropdownMenu.Item onclick={() => {
                                        publish(category.id);
                                    }}>
                                        <RenderIcon iconName={category.iconName} size={16} />
                                        {category.name}
                                    </DropdownMenu.Item>
                                {/each}
                            {:catch error}
                                <p class="text-red-500">{error.message}</p>
                            {/await}
                        </DropdownMenu.Group>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            {/if}
            <p class="ml-4">{noteTitle} - {statusText}</p>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Button variant="ghost" class="ml-4 w-4 h-6">
                        <ChevronDown />
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content class="w-48 mr-6">
                    <DropdownMenu.Group>
                        <DropdownMenu.GroupHeading>Rename</DropdownMenu.GroupHeading>
                        <DropdownMenu.Separator />
                        <Input class="mx-auto mt-3 mb-5 w-40" bind:value={noteTitle} />
                    </DropdownMenu.Group>
                    <DropdownMenu.Group>
                        <DropdownMenu.GroupHeading>Dangerous Zone</DropdownMenu.GroupHeading>
                        <DropdownMenu.Separator />
                        <Dialog.Root bind:open={deleteConfirmDialogIsOpen}>
                            <Dialog.Trigger class="w-full">
                                <DropdownMenu.Item class="text-red-500">
                                    <Trash2 />
                                    Delete
                                </DropdownMenu.Item>
                            </Dialog.Trigger>
                            <Dialog.Content>
                                <Dialog.Header>
                                    <Dialog.Title>
                                        Are you sure absolutely sure?
                                    </Dialog.Title>
                                    <Dialog.Description>
                                        This action cannot be undone. This will permanently delete the note.
                                    </Dialog.Description>
                                </Dialog.Header>
                                <Dialog.Footer>
                                    <Button variant="destructive" onclick={() => {deleteNote()}}>
                                        <Trash2 />Delete forever
                                    </Button>
                                    <Button variant="outline" onclick={() => {deleteConfirmDialogIsOpen = false}}>
                                        <Undo2 />Cancel
                                    </Button>
                                </Dialog.Footer>
                            </Dialog.Content>
                        </Dialog.Root>
                    </DropdownMenu.Group>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        {/if}
    </div>
</header>
<div class="">
    <div class="h-full px-4 pb-6 lg:px-8 mx-auto">
        {#await browser ? fetchContent() : Promise.resolve()}
            <div class="space-y-2 mt-8">
                <Skeleton class="h-4 w-[250px]" />
                <Skeleton class="h-4 w-[200px]" />
            </div>
        {:then content}
            {#if content}
                <ShadEditor class="h-[40rem]" content={content} onChanged={onChanged} />
            {/if}
        {:catch error}
            <p class="text-red-500">{error.message}</p>
        {/await}
    </div>
</div>
