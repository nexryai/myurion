<script lang="ts">
    import '../app.css';
    let { children } = $props();

    import House from "lucide-svelte/icons/house";
    import Search from "lucide-svelte/icons/search";
    import * as Collapsible from "$lib/components/ui/collapsible";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { ChevronUp, Ellipsis, Plus, Zap } from "lucide-svelte";
    import ChevronRight from "lucide-svelte/icons/chevron-right";

    import * as Command from "$lib/components/ui/command/index.js";

    import { goto } from "$app/navigation";
    import XWelcome from "$lib/components/XWelcome.svelte";

    // states
    let searchDialogIsOpen = $state(false);

    let isSignedIn = true;
</script>

{#if !isSignedIn}
    <XWelcome />
{:else }
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
                                        <a tabindex={0} href="/" {...props}>
                                            <Zap />
                                            <span>Quick Note</span>
                                        </a>
                                    {/snippet}
                                </Sidebar.MenuButton>
                            </Sidebar.MenuItem>
                            <Sidebar.MenuItem>
                                <Sidebar.MenuButton>
                                    {#snippet child({ props })}
                                        <div role="button" tabindex={1} {...props} onclick={() => {searchDialogIsOpen = !searchDialogIsOpen}}>
                                            <Search />
                                            <span>Search</span>
                                        </div>
                                    {/snippet}
                                </Sidebar.MenuButton>
                            </Sidebar.MenuItem>
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
                                                    <div {...props}>
                                                        <House />
                                                        <span>Personal</span>
                                                        <ChevronRight
                                                                class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                                        />
                                                    </div>
                                                {/snippet}
                                            </Sidebar.MenuButton>
                                        {/snippet}
                                    </Collapsible.Trigger>
                                    <Collapsible.Content>
                                        <Sidebar.MenuSub>
                                            <Sidebar.MenuSubItem>
                                                <Sidebar.MenuButton>
                                                    {#snippet child({ props })}
                                                        <a href="/test" {...props}>
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
                                <DropdownMenu.Item class="hover:cursor-pointer" onclick={() => {goto("/test")}}>
                                    <span>Settings</span>
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
            {@render children()}
        </div>
    </Sidebar.Provider>

    <Command.Dialog bind:open={searchDialogIsOpen}>
        <Command.Input placeholder="Type a command or search..." />
        <Command.List>
            <Command.Empty>No results found.</Command.Empty>
            <Command.Group heading="Suggestions">
                <Command.Item>Calendar</Command.Item>
                <Command.Item>Search Emoji</Command.Item>
                <Command.Item>Calculator</Command.Item>
            </Command.Group>
        </Command.List>
    </Command.Dialog>
{/if}


