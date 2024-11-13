<script lang="ts">
    import { Trigger as SidebarTrigger } from "$lib/components/ui/sidebar/index.js";
    import { browser } from '$app/environment';
    import ShadEditor from '$lib/components/shad-editor/shad-editor.svelte';
    import { writable } from 'svelte/store';


    let localStorageContent = '';

    if (browser) {
        localStorageContent = localStorage.getItem('content') || '';
    }

    const content = writable(localStorageContent);

    content.subscribe((value) => {
        console.log('Content Changed');
        if (!browser) return;
        localStorage.setItem('content', value);
    });
</script>

<header class="flex h-12 items-center justify-between px-4">
    <SidebarTrigger />
    <p class="ml-4">DEBUG EDITOR - saved</p>
</header>
<div class="">
    <div class="h-full px-4 pb-6 lg:px-8 mx-auto">
        <ShadEditor class="h-[40rem]" content={$content} />
    </div>
</div>
