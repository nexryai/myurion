<script lang="ts">
    import Calendar from "lucide-svelte/icons/calendar";
    import House from "lucide-svelte/icons/house";
    import Inbox from "lucide-svelte/icons/inbox";
    import Search from "lucide-svelte/icons/search";
    import Settings from "lucide-svelte/icons/settings";
    import * as Collapsible from "$lib/components/ui/collapsible";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { ChevronUp, Ellipsis, Plus, Zap } from "lucide-svelte";
    import ChevronRight from "lucide-svelte/icons/chevron-right";

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

    // Menu items.
    const items = [
        {
            title: "Quick Note",
            url: "#",
            icon: Zap,
        },
        {
            title: "Search",
            url: "#",
            icon: Search,
        },
    ];
</script>

<Sidebar.Provider class="w-screen justify-center">
    <Sidebar.Root >
        <Sidebar.Header />
        <Sidebar.Content class="">
            <Sidebar.Group>
                <Sidebar.GroupContent>
                    <Sidebar.Menu>
                        <Sidebar.MenuItem>
                            <Sidebar.MenuButton isActive>
                                {#snippet child({ props })}
                                    <a href="/" {...props}>
                                        <House />
                                        <span>Home</span>
                                    </a>
                                {/snippet}
                            </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                        {#each items as item (item.title)}
                            <Sidebar.MenuItem>
                                <Sidebar.MenuButton>
                                    {#snippet child({ props })}
                                        <a href={item.url} {...props}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    {/snippet}
                                </Sidebar.MenuButton>
                            </Sidebar.MenuItem>
                        {/each}
                    </Sidebar.Menu>
                </Sidebar.GroupContent>
            </Sidebar.Group>
            <Sidebar.Group>
                <Sidebar.GroupLabel>Notes</Sidebar.GroupLabel>
                <Sidebar.GroupAction title="Add Project">
                    <Plus /> <span class="sr-only">Add Project</span>
                </Sidebar.GroupAction>
                <Sidebar.GroupContent>
                    <Sidebar.Menu>
                        <Collapsible.Root open class="group/collapsible">
                            <Sidebar.MenuItem>
                                <Collapsible.Trigger>
                                    {#snippet child({ props })}
                                        <Sidebar.MenuButton {...props}>
                                            {#snippet child({ props })}
                                                <a href="/" {...props}>
                                                    <House />
                                                    <span>Personal</span>
                                                    <ChevronRight
                                                            class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                                    />
                                                </a>
                                            {/snippet}
                                        </Sidebar.MenuButton>
                                    {/snippet}
                                </Collapsible.Trigger>
                                <Collapsible.Content>
                                    <Sidebar.MenuSub>
                                        <Sidebar.MenuSubItem>
                                            <Sidebar.MenuButton>
                                                {#snippet child({ props })}
                                                    <a href="/" {...props}>
                                                        <House />
                                                        <span>Home</span>
                                                    </a>
                                                {/snippet}
                                            </Sidebar.MenuButton>
                                            <DropdownMenu.Root>
                                                <DropdownMenu.Trigger>
                                                    {#snippet child({ props })}
                                                        <Sidebar.MenuAction {...props}>
                                                            <Ellipsis />
                                                        </Sidebar.MenuAction>
                                                    {/snippet}
                                                </DropdownMenu.Trigger>
                                                <DropdownMenu.Content side="left" align="start">
                                                    <DropdownMenu.Item>
                                                        <span>Edit Project</span>
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Item>
                                                        <span>Delete Project</span>
                                                    </DropdownMenu.Item>
                                                </DropdownMenu.Content>
                                            </DropdownMenu.Root>
                                        </Sidebar.MenuSubItem>
                                    </Sidebar.MenuSub>
                                </Collapsible.Content>
                            </Sidebar.MenuItem>
                        </Collapsible.Root>
                    </Sidebar.Menu>
                </Sidebar.GroupContent>
            </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
            <Sidebar.Menu>
                <Sidebar.MenuItem>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            {#snippet child({ props })}
                                <Sidebar.MenuButton
                                        {...props}
                                        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    Username
                                    <ChevronUp class="ml-auto" />
                                </Sidebar.MenuButton>
                            {/snippet}
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content
                                side="top"
                                class="w-[--bits-dropdown-menu-anchor-width]"
                        >
                            <DropdownMenu.Item>
                                <span>Account</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item>
                                <span>Billing</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item>
                                <span>Sign out</span>
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </Sidebar.MenuItem>
            </Sidebar.Menu>
        </Sidebar.Footer>
    </Sidebar.Root>
    <div class="w-full">
        <header class="flex h-12 items-center justify-between px-4">
            <Sidebar.Trigger />
            <p class="ml-4">DEBUG EDITOR - saved</p>
        </header>
        <div class="">
            <div class="h-full px-4 pb-6 lg:px-8 mx-auto">
                <ShadEditor class="h-[40rem]" content={$content} />
            </div>
        </div>
    </div>
</Sidebar.Provider>
