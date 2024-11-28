<script lang="ts">
    import { Trigger as SidebarTrigger } from "$lib/components/ui/sidebar/index.js";
    import ShadEditor from '$lib/components/shad-editor/shad-editor.svelte';
    import type { Content } from "@tiptap/core";
    import { callApi } from "$lib/browser/api";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { allowUnload, preventUnload } from "$lib/browser/lock";

    // const localStorageContent = browser ? localStorage.getItem('quickNoteContent') || '' : '';
    const fetchContent = async () => {
        try {
            const response = await callApi("/api/me/quick-note", "GET") as unknown as { content: string };
            return JSON.parse(response.content) as Content;
        } catch (error) {
            console.error(error);
            return '';
        }
    };

    let timer: number | null = null;

    const onChanged = (content: Content) => {
        preventUnload();
        localStorage.setItem('quickNoteContent', JSON.stringify(content));

        if (timer) {
            window.clearTimeout(timer);
        }

        timer = window.setTimeout(() => {
            try {
                callApi("/api/me/quick-note", "POST", {
                    "content" : JSON.stringify(content)
                });
            } catch (error) {
                console.error(error);
            } finally {
                allowUnload();
            }
        }, 1000);
    };
</script>

<header class="flex h-12 items-center justify-between px-4">
    <SidebarTrigger />
    <p class="ml-4">DEBUG EDITOR - saved</p>
</header>
<div class="">
    <div class="h-full px-4 pb-6 lg:px-8 mx-auto">
        {#await fetchContent()}
            <div class="space-y-2 mt-8">
                <Skeleton class="h-4 w-[250px]" />
                <Skeleton class="h-4 w-[200px]" />
            </div>
        {:then content}
            <ShadEditor class="h-[40rem]" content={content} onChanged={onChanged} />
        {:catch error}
            <p class="text-red-500">{error.message}</p>
        {/await}
    </div>
</div>
