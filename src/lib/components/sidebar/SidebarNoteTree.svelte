<script lang="ts">
    import type { NoteTree } from "$lib/schema/note";
    import * as Collapsible from "$lib/components/ui/collapsible";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import ChevronRight from "lucide-svelte/icons/chevron-right";
    import RenderIcon from "$lib/components/icons/RenderIcon.svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    let {
        tree,
        currentPath = $bindable($page.url.pathname)
    }: {
        tree: NoteTree[];
        currentPath: string;
    } = $props();

    const shouldCollapse = (category: NoteTree): boolean => {
        for (const note of category.notes) {
            if (currentPath === `/note/${note.id}`) {
                return false;
            }
        }

        return true;
    };
</script>

<Sidebar.Menu>
    {#each tree as category}
        <Collapsible.Root open={!shouldCollapse(category)} class="group/collapsible">
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
                                <Sidebar.MenuButton onclick={() => {goto(`/note/${note.id}`);}} isActive={currentPath === `/note/${note.id}` }>
                                    {#snippet child({ props })}
                                        <span {...props}>{note.title}</span>
                                    {/snippet}
                                </Sidebar.MenuButton>
                            </Sidebar.MenuSubItem>
                        {/each}
                    </Sidebar.MenuSub>
                </Collapsible.Content>
            </Sidebar.MenuItem>
        </Collapsible.Root>
    {/each}
</Sidebar.Menu>
