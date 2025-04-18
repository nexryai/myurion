<script lang="ts">
	import { type Editor } from "@tiptap/core";
	import { Check, ChevronDown, PenTool } from "lucide-svelte";

	import { Button } from "$lib/components/ui/button/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { cn } from "$lib/utils.js";

	let { editor }: { editor: Editor } = $props();

	const colors = [
	    { label: "Default", value: "" },
	    { label: "Blue", value: "#0000FF" },
	    { label: "Brown", value: "#A52A2A" },
	    { label: "Green", value: "#008000" },
	    { label: "Grey", value: "#808080" },
	    { label: "Orange", value: "#FFA500" },
	    { label: "Pink", value: "#FFC0CB" },
	    { label: "Purple", value: "#800080" },
	    { label: "Red", value: "#FF0000" },
	    { label: "Yellow", value: "#FFFF00" }
	];

	const currentColor = $derived(editor.getAttributes("textStyle").color);
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button variant="ghost" size="sm" class={cn("h-8", currentColor && "bg-muted")}>
						<PenTool />
						<ChevronDown class="size-3! text-muted-foreground" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="max-h-[25rem] w-40 overflow-auto">
					<DropdownMenu.Group>
						<span class="text-[0.75rem] font-medium text-muted-foreground">Text Color</span>
						{#each colors as color}
							<DropdownMenu.Item
								class="flex items-center"
								onclick={() => {
								    if (color.value === "" || color.label === "Default")
								        editor.chain().focus().unsetColor().run();
								    else
								        editor
								            .chain()
								            .focus()
								            .setColor(currentColor === color.value ? "" : color.value)
								            .run();
								}}
								closeOnSelect={false}
							>
								<span class="rounded border px-1 py-px font-medium" style={`color: ${color.value}`}
									>A</span
								>
								<span>{color.label}</span>
								{#if editor.isActive("textStyle", { color: color.value })}
									<Check class="absolute right-2 size-3! text-muted-foreground" />
								{/if}
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Quick Colors</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
