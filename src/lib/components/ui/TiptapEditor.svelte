<script>
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';
	import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
	import TaskList from '@tiptap/extension-task-list';
	import TaskItem from '@tiptap/extension-task-item';
	import Placeholder from '@tiptap/extension-placeholder';
	import Typography from '@tiptap/extension-typography';
	import { common, createLowlight } from 'lowlight';

	const lowlight = createLowlight(common);

	let { content = $bindable(''), placeholder = '내용을 입력하세요...', editable = true } = $props();

	let element;
	let editor = $state();

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit.configure({
					codeBlock: false,
					heading: {
						levels: [1, 2, 3, 4, 5, 6]
					}
				}),
				Link.configure({
					openOnClick: false,
					HTMLAttributes: {
						class: 'text-primary-500 underline'
					}
				}),
				Image.configure({
					HTMLAttributes: {
						class: 'max-w-full h-auto rounded-lg'
					}
				}),
				CodeBlockLowlight.configure({
					lowlight
				}),
				TaskList.configure({
					HTMLAttributes: {
						class: 'space-y-2'
					}
				}),
				TaskItem.configure({
					nested: true,
					HTMLAttributes: {
						class: 'flex items-start gap-2'
					}
				}),
				Placeholder.configure({
					placeholder
				}),
				Typography
			],
			content: content,
			editable: editable,
			onTransaction: () => {
				editor = editor;
			},
			onUpdate: ({ editor }) => {
				content = editor.getHTML();
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	$effect(() => {
		if (editor && content !== editor.getHTML()) {
			editor.commands.setContent(content, false);
		}
	});

	$effect(() => {
		if (editor) {
			editor.setEditable(editable);
		}
	});

	function toggleHeading(level) {
		editor.chain().focus().toggleHeading({ level }).run();
	}

	function toggleBold() {
		editor.chain().focus().toggleBold().run();
	}

	function toggleItalic() {
		editor.chain().focus().toggleItalic().run();
	}

	function toggleStrike() {
		editor.chain().focus().toggleStrike().run();
	}

	function toggleCode() {
		editor.chain().focus().toggleCode().run();
	}

	function toggleCodeBlock() {
		editor.chain().focus().toggleCodeBlock().run();
	}

	function toggleBulletList() {
		editor.chain().focus().toggleBulletList().run();
	}

	function toggleOrderedList() {
		editor.chain().focus().toggleOrderedList().run();
	}

	function sinkListItem() {
		editor.chain().focus().sinkListItem('listItem').run();
	}

	function liftListItem() {
		editor.chain().focus().liftListItem('listItem').run();
	}

	function toggleTaskList() {
		editor.chain().focus().toggleTaskList().run();
	}

	function toggleBlockquote() {
		editor.chain().focus().toggleBlockquote().run();
	}

	function setHorizontalRule() {
		editor.chain().focus().setHorizontalRule().run();
	}

	function setLink() {
		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('URL:', previousUrl);

		if (url === null) {
			return;
		}

		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}

		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}

	function addImage() {
		const url = window.prompt('이미지 URL:');

		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	}
</script>

{#if editable}
	<div
		class="tiptap-toolbar flex flex-wrap gap-1 p-2 bg-surface-100-800-token rounded-t-lg border-b border-surface-300-600-token"
	>
		<div class="flex gap-1">
			<button
				type="button"
				onclick={() => toggleHeading(1)}
				class="btn btn-sm variant-ghost-surface"
				class:variant-filled-primary={editor?.isActive('heading', { level: 1 })}
			>
				H1
			</button>
			<button
				type="button"
				onclick={() => toggleHeading(2)}
				class="btn btn-sm variant-ghost-surface"
				class:variant-filled-primary={editor?.isActive('heading', { level: 2 })}
			>
				H2
			</button>
			<button
				type="button"
				onclick={() => toggleHeading(3)}
				class="btn btn-sm variant-ghost-surface"
				class:variant-filled-primary={editor?.isActive('heading', { level: 3 })}
			>
				H3
			</button>
		</div>

		<div class="w-px bg-surface-300-600-token"></div>

		<div class="flex gap-1">
			<button
				type="button"
				onclick={toggleBold}
				class="btn btn-sm variant-ghost-surface"
				class:variant-filled-primary={editor?.isActive('bold')}
			>
				<strong>B</strong>
			</button>
			<button
				type="button"
				onclick={toggleItalic}
				class="btn btn-sm variant-ghost-surface"
				class:variant-filled-primary={editor?.isActive('italic')}
			>
				<em>I</em>
			</button>
			<button
				type="button"
				onclick={toggleStrike}
				class="btn btn-sm variant-ghost-surface"
				class:variant-filled-primary={editor?.isActive('strike')}
			>
				<s>S</s>
			</button>
			<button
				type="button"
				onclick={toggleCode}
				class="btn btn-sm variant-ghost-surface"
				class:variant-filled-primary={editor?.isActive('code')}
			>
				<code>&lt;/&gt;</code>
			</button>
		</div>

		<div class="w-px bg-surface-300-600-token"></div>

		<div class="flex gap-1">
			<button
				type="button"
				onclick={toggleBulletList}
				class="btn btn-sm variant-ghost-surface"
				class:variant-filled-primary={editor?.isActive('bulletList')}
			>
				• 목록
			</button>
			<button
				type="button"
				onclick={toggleOrderedList}
				class="btn btn-sm variant-ghost-surface"
				class:variant-filled-primary={editor?.isActive('orderedList')}
			>
				1. 목록
			</button>
			<button
				type="button"
				onclick={toggleTaskList}
				class="btn btn-sm variant-ghost-surface"
				class:variant-filled-primary={editor?.isActive('taskList')}
			>
				☐ 할 일
			</button>
			<button
				type="button"
				onclick={sinkListItem}
				class="btn btn-sm variant-ghost-surface"
				title="들여쓰기"
				disabled={!editor?.can().sinkListItem('listItem')}
			>
				→
			</button>
			<button
				type="button"
				onclick={liftListItem}
				class="btn btn-sm variant-ghost-surface"
				title="내어쓰기"
				disabled={!editor?.can().liftListItem('listItem')}
			>
				←
			</button>
		</div>

		<div class="w-px bg-surface-300-600-token"></div>

		<div class="flex gap-1">
			<button
				type="button"
				onclick={toggleBlockquote}
				class="btn btn-sm variant-ghost-surface"
				class:variant-filled-primary={editor?.isActive('blockquote')}
			>
				인용
			</button>
			<button
				type="button"
				onclick={toggleCodeBlock}
				class="btn btn-sm variant-ghost-surface"
				class:variant-filled-primary={editor?.isActive('codeBlock')}
			>
				코드 블록
			</button>
			<button type="button" onclick={setHorizontalRule} class="btn btn-sm variant-ghost-surface">
				—
			</button>
		</div>

		<div class="w-px bg-surface-300-600-token"></div>

		<div class="flex gap-1">
			<button
				type="button"
				onclick={setLink}
				class="btn btn-sm variant-ghost-surface"
				class:variant-filled-primary={editor?.isActive('link')}
			>
				링크
			</button>
			<button type="button" onclick={addImage} class="btn btn-sm variant-ghost-surface">
				이미지
			</button>
		</div>
	</div>
{/if}

<div class="tiptap-editor" bind:this={element}></div>

<style>
	:global(.tiptap-editor) {
		min-height: 300px;
		padding: 1rem;
		background: rgb(var(--color-surface-50));
		border: 1px solid rgb(var(--color-surface-300));
		border-top: 0;
		border-bottom-left-radius: 0.5rem;
		border-bottom-right-radius: 0.5rem;
	}

	:global(.dark .tiptap-editor) {
		background: rgb(var(--color-surface-800));
		border-color: rgb(var(--color-surface-600));
	}

	:global(.tiptap-editor .ProseMirror) {
		outline: none;
		min-height: 300px;
	}

	:global(.tiptap-editor .ProseMirror > * + *) {
		margin-top: 0.75em;
	}

	:global(.tiptap-editor h1) {
		font-size: 2em;
		font-weight: bold;
		line-height: 1.1;
	}

	:global(.tiptap-editor h2) {
		font-size: 1.5em;
		font-weight: bold;
		line-height: 1.1;
	}

	:global(.tiptap-editor h3) {
		font-size: 1.25em;
		font-weight: bold;
		line-height: 1.1;
	}

	:global(.tiptap-editor code) {
		background-color: rgba(var(--color-surface-300), 0.5);
		color: rgb(var(--color-primary-500));
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
	}

	:global(.dark .tiptap-editor code) {
		background-color: rgba(var(--color-surface-600), 0.5);
	}

	:global(.tiptap-editor pre) {
		background: rgb(var(--color-surface-200));
		color: rgb(var(--color-surface-900));
		font-family: 'JetBrainsMono', monospace;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
	}

	:global(.dark .tiptap-editor pre) {
		background: rgb(var(--color-surface-700));
		color: rgb(var(--color-surface-50));
	}

	:global(.tiptap-editor pre code) {
		background: none;
		padding: 0;
		color: inherit;
		font-size: 0.875rem;
	}

	:global(.tiptap-editor blockquote) {
		padding-left: 1rem;
		border-left: 3px solid rgb(var(--color-surface-300));
	}

	:global(.dark .tiptap-editor blockquote) {
		border-left-color: rgb(var(--color-surface-600));
	}

	:global(.tiptap-editor hr) {
		border: none;
		border-top: 1px solid rgb(var(--color-surface-300));
		margin: 2rem 0;
	}

	:global(.dark .tiptap-editor hr) {
		border-top-color: rgb(var(--color-surface-600));
	}

	:global(.tiptap-editor img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
	}

	:global(.tiptap-editor ul) {
		list-style-type: disc;
		margin-left: 1.5rem;
		padding-left: 0.5rem;
	}

	:global(.tiptap-editor ol) {
		list-style-type: decimal;
		margin-left: 1.5rem;
		padding-left: 0.5rem;
	}

	:global(.tiptap-editor li) {
		margin-bottom: 0.25rem;
	}

	:global(.tiptap-editor ul ul, .tiptap-editor ol ul) {
		list-style-type: circle;
		margin-left: 1.5rem;
	}

	:global(.tiptap-editor ul ul ul, .tiptap-editor ol ul ul) {
		list-style-type: square;
	}

	:global(.tiptap-editor ul ol, .tiptap-editor ol ol) {
		list-style-type: lower-alpha;
		margin-left: 1.5rem;
	}

	:global(.tiptap-editor ul[data-type='taskList']) {
		list-style: none;
		padding: 0;
	}

	:global(.tiptap-editor ul[data-type='taskList'] li) {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
	}

	:global(.tiptap-editor ul[data-type='taskList'] li > label) {
		flex: 0 0 auto;
		margin-top: 0.25rem;
	}

	:global(.tiptap-editor ul[data-type='taskList'] li > div) {
		flex: 1 1 auto;
	}

	:global(.tiptap-editor .ProseMirror-focused) {
		outline: none;
	}

	:global(.tiptap-editor p.is-editor-empty:first-child::before) {
		color: rgb(var(--color-surface-400));
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
</style>
