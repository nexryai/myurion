<script lang="ts">
    import { browser } from "$app/environment";
    import { beforeNavigate, goto } from "$app/navigation";
    import { onDestroy } from "svelte";

    import { IconFileTextSpark } from "@tabler/icons-svelte";
    import type { Content } from "@tiptap/core";
    import { ChevronDown, CloudAlert, Trash2, Undo2 } from "lucide-svelte";
    import { toast } from "svelte-sonner";

    import { callApi } from "$lib/browser/api";
    import { isSafari } from "$lib/browser/env";
    import RenderIcon from "$lib/components/icons/RenderIcon.svelte";
    import ShadEditor from "$lib/components/shad-editor/shad-editor.svelte";
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Trigger as SidebarTrigger, useSidebar } from "$lib/components/ui/sidebar/index.js";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import type { NoteCategory } from "@prisma/client";

    // Props
    let {
        title,
        noteId
    }: {
        title: string | null;
        noteId: string | null;
    } = $props();

    const sidebar = useSidebar();
    const browserIsSafari = isSafari();
    const noteEndpoint = noteId ? `/api/note/${noteId}` : "/api/me/quick-note";
    let timer: number | null = null;
    let allowUnload = true;
    let lastSavedContentJson: string | null = null;

    // States
    let sidebarIsOpen = $state(true);
    let noteTitle = $state(title ?? "Loading...");
    let characterCount = $state(0);
    let createdAt: Date | undefined = $state(undefined);
    let statusText = $state("saved");
    let connectionIsLost = $state(false);
    let publishTitle = $state("Untitled");
    let deleteConfirmDialogIsOpen = $state(false);

    const onSidebarStateChanged = () => {
        if (sidebar.isMobile) {
            sidebarIsOpen = false;
            return;
        } else {
            setTimeout(() => {
                sidebarIsOpen = sidebar.open;
            }, 200);
        }
    };

    const fetchContent = async () => {
        try {
            const response = await callApi<{ title?: string, content: string, createdAt?: string }>(noteEndpoint, "GET");
            noteTitle = noteId ? response.title ?? "Untitled" : "Quick Note";
            createdAt = response.createdAt ? new Date(response.createdAt) : undefined;
            return response.content ? JSON.parse(response.content) as Content : "Start writing...";
        } catch (error) {
            console.error(error);
            return "";
        }
    };

    const fetchNoteCategories = async (): Promise<NoteCategory[]> => {
        return callApi<NoteCategory[]>("/api/note/categories", "GET");
    };

    const onChanged = (content: Content) => {
        const contentJson = JSON.stringify(content);
        if (contentJson === lastSavedContentJson) {
            return;
        } else {
            allowUnload = false;
        }

        statusText = "saving...";

        if (timer) {
            window.clearTimeout(timer);
        }

        timer = window.setTimeout(() => {
            const request = noteId ? {
                "title" : noteTitle,
                "content" : contentJson
            }: {
                "content" : contentJson
            };

            callApi(noteEndpoint, "PUT", request).catch(error => {
                console.error("Failed to save content", error);
                toast.error("Failed to save content");
                connectionIsLost = true;
                statusText = "NOT SAVED - ERROR";
            }).then(() => {
                statusText = "saved";
                lastSavedContentJson = contentJson;
                connectionIsLost = false;
                allowUnload = true;
            });
        }, 1000);
    };

    const publish = async (categoryId: string) => {
        if (!publishTitle) {
            toast.error("Title is required");
            return;
        }

        const response = await callApi<{ created: string }>("/api/me/promote-quick-note", "POST", {
            title: publishTitle,
            categoryId,
        });

        if (response.created) {
            toast.success("Published");
            await goto(`/note/${response.created}`);
        } else {
            toast.error("Failed to publish");
        }
    };

    const deleteNote = async () => {
        const response = await callApi<{ ok: boolean }>(noteEndpoint, "DELETE");

        if (response.ok) {
            toast.success("Deleted");
            await goto("/");
        } else {
            toast.error("Failed to delete");
        }
    };

    beforeNavigate(({ cancel }) => {
        if (!allowUnload) {
            if (!confirm("Are you sure you want to leave this page? You have unsaved changes that will be lost.")) {
                cancel();
            }
        }
    });

    onDestroy(() => {
        if (timer) {
            window.clearTimeout(timer);
        }
    });
</script>

<header
        class="flex h-12 items-center justify-between px-4 fixed z-10 editor-width-sidebar-open"
        id="myurion-editor-header"
        class:editor-width-sidebar-closed={!sidebarIsOpen && browserIsSafari}
        class:editor-width-on-smart-browsers={!browserIsSafari}
>
    <SidebarTrigger onclick={() => {onSidebarStateChanged();}} />
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
            {#if noteId}
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button variant="ghost" class="ml-4 w-4 h-6">
                            <ChevronDown />
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content class="w-80 mr-6">
                        <DropdownMenu.Group>
                            <DropdownMenu.GroupHeading>Properties</DropdownMenu.GroupHeading>
                            <DropdownMenu.Separator />
                            <div class="grid grid-cols-3 grid-rows-3 gap-4 p-4">
                                <div><Label>Title</Label></div>
                                <div class="col-span-2"><Input class="mx-auto w-40" bind:value={noteTitle} /></div>
                                <div class="row-start-2"><Label>Character Count</Label></div>
                                <div class="col-span-2 row-start-2"><p class="ml-5">{characterCount}</p></div>
                                <div class="row-start-3"><Label>Created At</Label></div>
                                <div class="col-span-2 row-start-3"><p class="ml-5">{createdAt ? createdAt.toLocaleString(navigator.language, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }) : "Unknown"}</p></div>
                            </div>
                        </DropdownMenu.Group>
                        <DropdownMenu.Group>
                            <Dialog.Root bind:open={deleteConfirmDialogIsOpen}>
                                <Dialog.Trigger class="w-full text-right">
                                    <Button variant="destructive" class="mb-4 mr-4">
                                        <Trash2 />
                                        Delete
                                    </Button>
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
                                        <Button variant="destructive" onclick={() => {deleteNote();}}>
                                            <Trash2 />Delete forever
                                        </Button>
                                        <Button variant="outline" onclick={() => {deleteConfirmDialogIsOpen = false;}}>
                                            <Undo2 />Cancel
                                        </Button>
                                    </Dialog.Footer>
                                </Dialog.Content>
                            </Dialog.Root>
                        </DropdownMenu.Group>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            {/if}
        {/if}
    </div>
</header>
<div class="mt-12">
    <div class="pb-6">
        {#await browser ? fetchContent() : Promise.resolve()}
            <div class="space-y-2 mx-12 mt-32">
                <Skeleton class="h-4 w-[250px]" />
                <Skeleton class="h-4 w-[200px]" />
            </div>
        {:then content}
            {#if content}
                <ShadEditor content={content} bind:characterCount={characterCount} bind:sidebarIsOpen={sidebarIsOpen} onChanged={onChanged} />
            {/if}
        {:catch error}
            <p class="text-red-500">{error.message}</p>
        {/await}
    </div>
</div>

<style>
    #myurion-editor-header {
        background-color: #ffffff;
    }

    .editor-width-on-smart-browsers {
        /* 切り替えがスムーズになるからほんとはこっちを使いたいけど、Safariでは挙動が違うため使えない */
        width: -webkit-fill-available !important;
        width: -moz-available !important;
    }

    @media (min-width: 768px) {
        .editor-width-sidebar-open {
            width: calc(100vw - 256px);
        }
    }

    @media (max-width: 768px) {
        .editor-width-sidebar-open {
            width: 100vw;
        }
    }

    .editor-width-sidebar-closed {
        width: 100vw !important;
    }
</style>
