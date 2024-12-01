<script lang="ts">
    import type { NoteTree } from "$lib/schema/note";
    import * as Collapsible from "$lib/components/ui/collapsible";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { Ellipsis } from "lucide-svelte";
    import ChevronRight from "lucide-svelte/icons/chevron-right";
    import RenderIcon from "$lib/components/icons/RenderIcon.svelte";
    import { goto } from "$app/navigation";

    let {
        tree
    }: {
        tree: NoteTree[];
    } = $props();
</script>

<Sidebar.Menu>
    {#each tree as category}
        <Collapsible.Root open class="group/collapsible">
            <Sidebar.MenuItem>
                <Collapsible.Trigger>
                    {#snippet child({ props })}
                        <Sidebar.MenuButton {...props}>
                            {#snippet child({ props })}
                                <div {...props}>
                                    <RenderIcon size={18} iconName={category.iconName} />
                                    <span>{category.name}</span>
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
                        {#each category.notes as note}
                            <Sidebar.MenuSubItem>
                                <Sidebar.MenuButton onclick={() => {goto(`/note/${note.id}`)}}>
                                    {#snippet child({ props })}
                                        <span {...props}>{note.title}</span>
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
                                            <span>Edit Note</span>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item>
                                            <span>Delete Note</span>
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </Sidebar.MenuSubItem>
                        {/each}
                    </Sidebar.MenuSub>
                </Collapsible.Content>
            </Sidebar.MenuItem>
        </Collapsible.Root>
    {/each}
</Sidebar.Menu>
