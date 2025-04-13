<script lang="ts">
	import { type Editor } from "@tiptap/core";
	import {
	    Heading1,
	    Heading2,
	    Heading3,
	    Heading4,
	    Heading5,
	    Heading6,
	    Pilcrow,
	    FileJson,
	    ChevronDown,
	    Check,
	    Minus
	} from "lucide-svelte";

	import Button from "$lib/components/ui/button/button.svelte";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";

	let { editor }: { editor: Editor } = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button variant="ghost" size="sm" class="h-8">
						{#if editor.isActive("heading", { level: 1 })}
							<Heading1 />
						{:else if editor.isActive("heading", { level: 2 })}
							<Heading2 />
						{:else if editor.isActive("heading", { level: 3 })}
							<Heading3 />
						{:else if editor.isActive("heading", { level: 4 })}
							<Heading4 />
						{:else if editor.isActive("heading", { level: 5 })}
							<Heading5 />
						{:else if editor.isActive("heading", { level: 6 })}
							<Heading6 />
						{:else if editor.isActive("paragraph")}
							<Pilcrow />
						{:else if editor.isActive("codeBlock")}
							<FileJson />
						{:else}
							<Minus />
						{/if}
						<ChevronDown class="size-3! text-muted-foreground" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-56">
					<DropdownMenu.Item
						onclick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
						closeOnSelect={false}
					>
						<Heading1 /> Heading 1
						{#if editor.isActive("heading", { level: 1 })}
							<Check class="absolute right-2 size-3! text-muted-foreground" />
						{/if}
					</DropdownMenu.Item>
					<DropdownMenu.Item
						onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
						closeOnSelect={false}
					>
						<Heading2 /> Heading 2
						{#if editor.isActive("heading", { level: 2 })}
							<Check class="absolute right-2 size-3! text-muted-foreground" />
						{/if}
					</DropdownMenu.Item>
					<DropdownMenu.Item
						onclick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
						closeOnSelect={false}
					>
						<Heading3 /> Heading 3
						{#if editor.isActive("heading", { level: 3 })}
							<Check class="absolute right-2 size-3! text-muted-foreground" />
						{/if}
					</DropdownMenu.Item>
					<DropdownMenu.Item
						onclick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
						closeOnSelect={false}
					>
						<Heading4 /> Heading 4
						{#if editor.isActive("heading", { level: 4 })}
							<Check class="absolute right-2 size-3! text-muted-foreground" />
						{/if}
					</DropdownMenu.Item>
					<DropdownMenu.Item
						onclick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
						closeOnSelect={false}
					>
						<Heading5 /> Heading 5
						{#if editor.isActive("heading", { level: 5 })}
							<Check class="absolute right-2 size-3! text-muted-foreground" />
						{/if}
					</DropdownMenu.Item>
					<DropdownMenu.Item
						onclick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
						closeOnSelect={false}
					>
						<Heading6 /> Heading 6
						{#if editor.isActive("heading", { level: 6 })}
							<Check class="absolute right-2 size-3! text-muted-foreground" />
						{/if}
					</DropdownMenu.Item>
					<DropdownMenu.Item
						onclick={() => editor.chain().focus().setParagraph().run()}
						closeOnSelect={false}
					>
						<Pilcrow /> Paragraph
						{#if editor.isActive("paragraph")}
							<Check class="absolute right-2 size-3! text-muted-foreground" />
						{/if}
					</DropdownMenu.Item>
					<DropdownMenu.Item
						onclick={() => editor.chain().focus().toggleCodeBlock().run()}
						closeOnSelect={false}
					>
						<FileJson /> Code Block
						{#if editor.isActive("codeBlock")}
							<Check class="absolute right-2 size-3! text-muted-foreground" />
						{/if}
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Text Formatting</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
