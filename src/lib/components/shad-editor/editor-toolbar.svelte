<script lang="ts">
	import { type Editor } from "@tiptap/core";

	// import { Separator } from '$lib/components/ui/separator/index.js';
	import BlockQuote from "./icons/block-quote.svelte";
	import Bold from "./icons/bold.svelte";
	import ButtleList from "./icons/buttle-list.svelte";
	import Code from "./icons/code.svelte";
	import Highlighter from "./icons/highlighter.svelte";
	import Image from "./icons/image.svelte";
	import Italic from "./icons/italic.svelte";
	import Link from "./icons/link.svelte";
	import OrderedList from "./icons/ordered-list.svelte";
	import TextColor from "./icons/quickcolor.svelte";
	import Redo from "./icons/redo.svelte";
	import SearchReplace from "./icons/search-replace.svelte";
	import Strikethrough from "./icons/strikethrough.svelte";
	import Subscript from "./icons/subscript.svelte";
	import Superscript from "./icons/superscript.svelte";
	import Table from "./icons/table.svelte";
	import TaskList from "./icons/task-list.svelte";
	import Text from "./icons/text.svelte";
	import Align from "./icons/textalign.svelte";
	import Underline from "./icons/underline.svelte";
	import Undo from "./icons/undo.svelte";

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
</script>

<div class="items-center overflow-auto border rounded-xl mx-4 mt-1 p-1 *:mx-1 bg-white shadow-sm" id="toolbar-items">
	<Undo {editor} />
	<Redo {editor} />
	<!-- <Separator orientation="vertical" class="h-fit" /> -->
	<Text {editor} />
	<Bold {editor} />
	<Italic {editor} />
	<Underline {editor} />
	<Strikethrough {editor} />
	<Align {editor} />
	<Link {editor} />
	<Code {editor} />
	<BlockQuote {editor} />
	<Subscript {editor} />
	<Superscript {editor} />
	<ButtleList {editor} />
	<OrderedList {editor} />
	<TaskList {editor} />
	<Image {editor} />
	<Table {editor} />
	<Highlighter {editor} />
	<TextColor {editor} />
	<SearchReplace {editor} />
</div>
