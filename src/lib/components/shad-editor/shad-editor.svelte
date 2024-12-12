<script lang="ts">
	import "./editor.css";


	import { onDestroy, onMount } from "svelte";

	import { Editor, type Content } from "@tiptap/core";
	import CharacterCount from "@tiptap/extension-character-count";
	import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
	import Color from "@tiptap/extension-color";
	import Highlight from "@tiptap/extension-highlight";
	import { Link } from "@tiptap/extension-link";
	import { Subscript } from "@tiptap/extension-subscript";
	import { Superscript } from "@tiptap/extension-superscript";
	import Table from "@tiptap/extension-table";
	import TableCell from "@tiptap/extension-table-cell";
	import TableHeader from "@tiptap/extension-table-header";
	import TableRow from "@tiptap/extension-table-row";
	import TaskItem from "@tiptap/extension-task-item";
	import TaskList from "@tiptap/extension-task-list";
	import Text from "@tiptap/extension-text";
	import TextAlign from "@tiptap/extension-text-align";
	import TextStyle from "@tiptap/extension-text-style";
	import Typography from "@tiptap/extension-typography";
	import { Underline } from "@tiptap/extension-underline";
	import StarterKit from "@tiptap/starter-kit";
	import { all, createLowlight } from "lowlight";
	import { SvelteNodeViewRenderer } from "svelte-tiptap";

	import { isSafari } from "$lib/browser/env";
	import { cn } from "$lib/utils.js";

	import { ColorHighlighter } from "./custom/Extentions/ColorHighlighter.js";
	import { ImageExtension } from "./custom/Extentions/ImageExtention.js";
	import SearchAndReplace from "./custom/Extentions/SearchAndReplace.js";
	import { SmilieReplacer } from "./custom/Extentions/SmilieReplacer.js";
	import CodeExtended from "./custom/code-extended.svelte";
	import EditorToolbar from "./editor-toolbar.svelte";

	import "./onedark.css";

	const browserIsSafari = isSafari();
	const lowlight = createLowlight(all);

	interface Props {
		class?: string;
		content?: Content;
		characterCount?: number;
		showToolbar?: boolean;
		sidebarIsOpen?: boolean;
		onChanged?: (content: Content) => void;
	}

	let {
	    class: className = "",
	    content = $bindable(""),
	    characterCount = $bindable(0),
	    showToolbar = true,
	    sidebarIsOpen = $bindable(true),
	    onChanged = () => {}
	}: Props = $props();
	let editor = $state<Editor>();
	let element = $state<HTMLElement>();

	onMount(() => {
	    editor = new Editor({
	        element,
	        content,
	        editorProps: {
	            attributes: {
	                class:
						"m-auto p-2 focus:outline-none flex-1 prose text-foreground dark:prose-invert *:my-2"
	            }
	        },
	        extensions: [
	            StarterKit.configure({
	                orderedList: {
	                    HTMLAttributes: {
	                        class: "list-decimal"
	                    }
	                },
	                bulletList: {
	                    HTMLAttributes: {
	                        class: "list-disc"
	                    }
	                },
	                heading: {
	                    levels: [1, 2, 3, 4, 5, 6],
	                    HTMLAttributes: {
	                        class: "tiptap-heading"
	                    }
	                }
	            }),
	            Typography,
	            Text,
	            TextStyle,
	            TextAlign.configure({
	                types: ["heading", "paragraph"]
	            }),
	            Color,
	            Highlight.configure({ multicolor: true }),
	            Underline,
	            Superscript,
	            Subscript,
	            Link.configure({
	                openOnClick: false,
	                autolink: true,
	                defaultProtocol: "https",
	                HTMLAttributes: {
	                    target: "_blank",
	                    rel: "noopener noreferrer"
	                }
	            }),
	            TaskList,
	            TaskItem.configure({
	                nested: true
	            }),
	            SearchAndReplace,
	            CodeBlockLowlight.configure({
	                lowlight
	            }).extend({
	                addNodeView() {
	                    return SvelteNodeViewRenderer(CodeExtended);
	                }
	            }),
	            SmilieReplacer,
	            ColorHighlighter,
	            Table.configure({
	                allowTableNodeSelection: true,
	                resizable: true
	            }),
	            TableRow,
	            TableHeader,
	            TableCell,
	            ImageExtension,
	            CharacterCount
	        ],
	        autofocus: true,
	        onTransaction: (transaction) => {
	            /**
				 * Weird behavior of editor.
				 * If we do not make it undefined, then it looses it's reactivity
				 * this is because assigning editor directly to `transaction.editor`
				 * the original object is not mutated.
				 */
	            editor = undefined;
	            editor = transaction.editor;
	            content = editor.getJSON();
	            characterCount = editor.storage.characterCount.characters();
	            onChanged(content);
	        }
	    });
	});

	onDestroy(() => {
	    if (editor) editor.destroy();
	});
</script>

<div class={cn("flex flex-col rounded", className)}>
	{#if editor && showToolbar}
		<div
				class="fixed w-auto toolbar-width-sidebar-open"
				id="myurion-editor-toolbar"
				class:toolbar-width-sidebar-closed={!sidebarIsOpen && browserIsSafari}
				class:toolbar-width-on-smart-browsers={!browserIsSafari}
		>
			<EditorToolbar {editor} />
		</div>
	{/if}
	<div bind:this={element} spellcheck="false" class="w-full md:w-[70vw] mx-auto flex-1 mt-32"></div>
</div>

<style>
	#myurion-editor-toolbar {
		background-color: white;
		z-index: 5;
	}

	.toolbar-width-on-smart-browsers {
		/* 切り替えがスムーズになるからほんとはこっちを使いたいけど、Safariでは挙動が違うため使えない */
		width: -webkit-fill-available !important;
		width: -moz-available !important;
	}

	@media (min-width: 768px) {
		.toolbar-width-sidebar-open {
			width: calc(100vw - 256px);
		}
	}

	@media (max-width: 768px) {
		.toolbar-width-sidebar-open {
			width: 100vw;
		}
	}

	.toolbar-width-sidebar-closed {
		width: 100vw !important;
	}
</style>
