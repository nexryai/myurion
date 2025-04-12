<script lang="ts">
	import { type Editor } from "@tiptap/core";
	import { Image , ChevronDown, CircleAlert } from "lucide-svelte";
	
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";

	let { editor }: { editor: Editor } = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Popover.Root>
				<Popover.Trigger>
					<Button variant="ghost" size="sm" class="h-8">
						<Image />
						<ChevronDown class="!size-3 text-muted-foreground" />
					</Button>
				</Popover.Trigger>
				<Popover.Content class="bg-popover shadow-lg *:my-2">
					<Input
						id="picture"
						type="file"
						accept="image/*"
						multiple={false}
						onchange={(e: Event) => {
						    //@ts-ignore
						    if (e.target && e.target.files) {
						        //@ts-ignore
						        const files = Array.from(e.target.files || []);
						        files.map((file) => {
						            const reader = new FileReader();
						            reader.onload = () => {
						                const src = reader.result as string;
						                editor.chain().focus().setImage({ src }).run();
						            };
						            //@ts-ignore
						            reader.readAsDataURL(file);
						        });
						    }
						}}
					/>
					<div class="flex justify-between items-center p-2">
						<CircleAlert class="text-muted-foreground" size="24" />
						<p class="text-sm text-muted-foreground w-full ml-4">Upload an large image without S3 configuration, may cause performance issues.</p>
					</div>
				</Popover.Content>
			</Popover.Root>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Add Image</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
