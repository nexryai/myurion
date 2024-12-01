<script lang="ts">
	import { Check, Highlighter } from 'lucide-svelte';
	import { ChevronDown } from 'lucide-svelte';
	import { type Editor } from '@tiptap/core';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	interface Props {
		editor: Editor;
		color?: string;
	}

	const colors = [
		{ label: 'Default', value: '' },
		{ label: 'Blue', value: '#75a6ff' },
		{ label: 'Green', value: '#9ef19e' },
		{ label: 'Grey', value: '#808080' },
		{ label: 'Orange', value: '#FFA500' },
		{ label: 'Red', value: '#ffa6a6' },
		{ label: 'Yellow', value: '#FFFF00' }
	];

	let { editor, color = $bindable('') }: Props = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button
						variant="ghost"
						size="sm"
						class={cn('h-8', editor.isActive('highlight') && 'bg-muted')}
						onclick={() => editor.chain().focus()}
					>
						<Highlighter />
						<ChevronDown class="!size-3 text-muted-foreground" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="max-h-[25rem] w-40 overflow-auto">
					<DropdownMenu.Group>
						<span class="text-[0.75rem] font-medium text-muted-foreground">Highlight Color</span>
						{#each colors as color}
							<DropdownMenu.Item
									class="flex items-center"
									onclick={() => {
									if (color.value === '' || color.label === 'Default')
										editor.chain().focus().unsetHighlight().run();
									else editor.chain().focus().toggleHighlight({ color: color.value }).run();
								}}
									closeOnSelect={false}
							>
								<span
										class="rounded px-1 py-px font-medium"
										style={`background-color: ${color.value};`}>A</span
								>
								<span>{color.label}</span>
								{#if editor.isActive('highlight', { color: color.value })}
									<Check class="absolute right-2 !size-3 text-muted-foreground" />
								{/if}
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Highlighter (⌘⇧H)</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
