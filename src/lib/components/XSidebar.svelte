<script lang="ts">
    import House from "lucide-svelte/icons/house";
    import Search from "lucide-svelte/icons/search";
    import * as Collapsible from "$lib/components/ui/collapsible";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { ChevronUp, Ellipsis, Plus, Zap } from "lucide-svelte";
    import ChevronRight from "lucide-svelte/icons/chevron-right";

    import * as Command from "$lib/components/ui/command/index.js";

    import { goto } from "$app/navigation";
    import AddCategoryDialog from "$lib/components/auth/AddCategoryDialog.svelte";

    // states
    let searchDialogIsOpen = $state(false);
    let addCategoryDialogIsOpen = $state(false);
    let {
        username
    }: {
        username: string;
    } = $props();

</script>

<Sidebar.Root>
    <Sidebar.Header />
    <Sidebar.Content>
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
            <Sidebar.GroupAction title="Add Project" onclick={() => {addCategoryDialogIsOpen = true}}>
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
                                <span>{username}</span>
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

<AddCategoryDialog bind:isOpen={addCategoryDialogIsOpen} />

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

<style>
    :global {
        @tailwind base;
        @layer base {
            :root {
                --background: 0 0% 100%;
                --foreground: 240 10% 3.9%;
                --card: 0 0% 100%;
                --card-foreground: 240 10% 3.9%;
                --popover: 0 0% 100%;;
                --popover-foreground: 240 10% 3.9%;
                --primary: 240 5.9% 10%;
                --primary-foreground: 0 0% 98%;
                --secondary: 240 4.8% 95.9%;
                --secondary-foreground: 240 5.9% 10%;
                --muted: 240 4.8% 95.9%;
                --muted-foreground: 240 3.8% 46.1%;
                --accent: 240 4.8% 95.9%;
                --accent-foreground: 240 5.9% 10%;
                --destructive: 0 72.22% 50.59%;
                --destructive-foreground: 0 0% 98%;
                --border: 240 5.9% 90%;
                --input: 240 5.9% 90%;
                --ring: 240 5.9% 10%;
                --radius: 0.5rem;

                --sidebar-background: 0 0% 100%;
                --sidebar-foreground: 240 5.3% 26.1%;
                --sidebar-primary: 240 5.9% 10%;
                --sidebar-primary-foreground: 0 0% 98%;
                --sidebar-accent: 0, 0%, 69%, 0.14;
                --sidebar-accent-foreground: 240 5.9% 10%;
                --sidebar-border: 220 13% 91%;
                --sidebar-ring: 217.2 91.2% 59.8%;
            }
            .dark {
                --background: 240 10% 3.9%;
                --foreground: 0 0% 98%;
                --card: 240 10% 3.9%;
                --card-foreground: 0 0% 98%;
                --popover: 240 10% 3.9%;
                --popover-foreground: 0 0% 98%;
                --primary: 0 0% 98%;
                --primary-foreground: 240 5.9% 10%;
                --secondary: 240 3.7% 15.9%;
                --secondary-foreground: 0 0% 98%;
                --muted: 240 3.7% 15.9%;
                --muted-foreground: 240 5% 64.9%;
                --accent: 240 3.7% 15.9%;
                --accent-foreground: 0 0% 98%;
                --destructive: 0 62.8% 30.6%;
                --destructive-foreground: 0 0% 98%;
                --border: 240 3.7% 15.9%;
                --input: 240 3.7% 15.9%;
                --ring: 240 4.9% 83.9%;

                --sidebar-background: 240 5.9% 10%;
                --sidebar-foreground: 240 4.8% 95.9%;
                --sidebar-primary: 224.3 76.3% 48%;
                --sidebar-primary-foreground: 0 0% 100%;
                --sidebar-accent: transparent;
                --sidebar-accent-foreground: 240 4.8% 95.9%;
                --sidebar-border: 240 3.7% 15.9%;
                --sidebar-ring: 217.2 91.2% 59.8%;
            }
        }

        @layer base {
            * {
                @apply border-border;
            }
            body {
                @apply bg-background text-foreground;
            }
        }

        .bg-sidebar {
            position: relative;
            background-color: rgba(255, 255, 255, 0.74);
        }

        .bg-sidebar:before {
            content: '';
            background-image: url('/photo-1660491630578-4299a3c09db0-navbar.webp');
            background-blend-mode: multiply, screen, overlay;
            background-size:cover;
            background-position:50%;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            /*filter: blur(4px);*/
            z-index: -1;
        }
    }
</style>
