<script lang="ts">
	import { type Editor } from "@tiptap/core";
	import { Undo } from "lucide-svelte";

	import { Button } from "$lib/components/ui/button/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";

	let { editor }: { editor: Editor } = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				variant="ghost"
				class="size-8 p-0"
				onclick={() => editor.chain().focus().undo().run()}
				disabled={!editor.can().chain().focus().undo().run()}
			>
				<Undo />
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Undo (⌘Z)</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
