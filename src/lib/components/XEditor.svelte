<script lang="ts">
    import { Trigger as SidebarTrigger } from "$lib/components/ui/sidebar/index.js";
    import { browser } from '$app/environment';
    import ShadEditor from '$lib/components/shad-editor/shad-editor.svelte';
    import type { Content } from "@tiptap/core";

    const localStorageContent = browser ? localStorage.getItem('quickNoteContent') || '' : '';
    const content = browser ? JSON.parse(localStorageContent) as Content : '';

    const onChanged = (content: Content) => {
        localStorage.setItem('quickNoteContent', JSON.stringify(content));
    };
</script>

<header class="flex h-12 items-center justify-between px-4">
    <SidebarTrigger />
    <p class="ml-4">DEBUG EDITOR - saved</p>
</header>
<div class="">
    <div class="h-full px-4 pb-6 lg:px-8 mx-auto">
        <ShadEditor class="h-[40rem]" content={content} onChanged={onChanged} />
    </div>
</div>
