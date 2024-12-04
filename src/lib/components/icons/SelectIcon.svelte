<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import { userSelectableIcons } from "./icons";

    let {
        selected = $bindable("")
    }: {
        selected?: string;
    } = $props();

    const icons = userSelectableIcons;

    const triggerContent = $derived(
        icons.find((icon) => icon.name === selected)?.name ?? "Select an icon"
    );

    function setHTML(node: HTMLElement, html: string) {
        node.innerHTML = html;
        return {
            update(newHTML: string) {
                if (newHTML !== html) {
                    html = newHTML;
                    node.innerHTML = html;
                }
            }
        };
    }
</script>

<Select.Root type="single" name="iconSelector" bind:value={selected}>
    <Select.Trigger class="w-[180px]">
        {#if selected}
            <span use:setHTML={icons.find((icon) => icon.name === selected)?.svg || ""}></span>
            <span>{triggerContent}</span>
        {:else}
            <span>Select an icon</span>
        {/if}
    </Select.Trigger>
    <Select.Content>
        <Select.Group>
            <Select.GroupHeading>Icons</Select.GroupHeading>
            {#each icons as icon}
                <Select.Item value={icon.name} label={icon.name}>
                    <div class="flex items-center">
            <span
                    class="w-5 h-5 mr-2 select-item-icon"
                    use:setHTML={icon.svg}
            ></span>
                        {icon.name}
                    </div>
                </Select.Item>
            {/each}
        </Select.Group>
    </Select.Content>
</Select.Root>

<style lang="scss">
    :global {
        .select-item-icon {
            > .icon {
                padding-bottom: 4px;
            }
        }
    }
</style>
