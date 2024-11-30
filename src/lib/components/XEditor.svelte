<script lang="ts">
    import { Trigger as SidebarTrigger } from "$lib/components/ui/sidebar/index.js";
    import ShadEditor from '$lib/components/shad-editor/shad-editor.svelte';
    import type { Content } from "@tiptap/core";
    import { callApi } from "$lib/browser/api";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { allowUnload, preventUnload } from "$lib/browser/lock";
    import { toast } from "svelte-sonner";
    import { CloudAlert } from "lucide-svelte";
    import { browser } from "$app/environment";

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
    let statusText = $state('saved');
    let connectionIsLost = $state(false);

    const onChanged = (content: Content) => {
        preventUnload();
        statusText = 'saving...';

        if (timer) {
            window.clearTimeout(timer);
        }

        timer = window.setTimeout(() => {
            callApi("/api/me/quick-note", "POST", {
                "content" : JSON.stringify(content)
            }).catch(error => {
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
</script>

<header class="flex h-12 items-center justify-between px-4">
    <SidebarTrigger />
    {#if connectionIsLost}
        <div class="flex">
            <CloudAlert class="text-red-600" />
            <p class="animate-pulse ml-4 text-red-600">CONNECTION LOST - Not saved</p>
        </div>
    {:else }
        <p class="ml-4">DEBUG EDITOR - {statusText}</p>
    {/if}
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
