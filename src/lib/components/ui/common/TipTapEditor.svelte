<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	// Props
	let { 
		content = '', 
		placeholder = '내용을 입력하세요...', 
		onUpdate = null,
		class: className = ''
	} = $props();

	// Editor instance
	let editor;
	let editorElement;

	// Initialize editor
	onMount(async () => {
		if (!browser || !editorElement) return;

		try {
			const { Editor } = await import('@tiptap/core');
			const { default: StarterKit } = await import('@tiptap/starter-kit');
			const { default: Placeholder } = await import('@tiptap/extension-placeholder');

			editor = new Editor({
				element: editorElement,
				extensions: [
					StarterKit.configure({
						heading: {
							levels: [1, 2, 3, 4, 5, 6],
						},
					}),
					Placeholder.configure({
						placeholder,
					}),
				],
				content: content || '<p></p>',
				onTransaction: () => {
					// Force re-render
					editor = editor;
				},
				onUpdate: ({ editor }) => {
					const html = editor.getHTML();
					if (onUpdate) {
						onUpdate(html);
					}
				},
				editorProps: {
					attributes: {
						class: 'prose prose-sm focus:outline-none p-4 min-h-64',
					},
				},
			});
		} catch (error) {
			console.error('TipTap 에디터 초기화 실패:', error);
		}
	});

	// Update content when prop changes
	$effect(() => {
		if (editor && content && content !== editor.getHTML()) {
			editor.commands.setContent(content, false);
		}
	});

	// Cleanup
	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	// Expose methods
	const getContent = () => editor?.getHTML() || '';
	const setContent = (newContent) => {
		if (editor) {
			editor.commands.setContent(newContent);
		}
	};
	const focus = () => editor?.commands.focus();

	// Export methods for parent component
	export { getContent, setContent, focus };
</script>

<div class={`tiptap-wrapper border border-surface-300 rounded-lg ${className}`}>
	<!-- Editor toolbar -->
	{#if editor}
		<div class="tiptap-toolbar border-b border-surface-300 p-2 flex flex-wrap gap-1 bg-surface-100">
			<button
				type="button"
				class={`px-2 py-1 text-sm rounded ${editor.isActive('bold') ? 'bg-primary-500 text-white' : 'bg-surface-200 hover:bg-surface-300'}`}
				onclick={() => editor.chain().focus().toggleBold().run()}
				title="굵게"
			>
				<strong>B</strong>
			</button>
			<button
				type="button"
				class={`px-2 py-1 text-sm rounded ${editor.isActive('italic') ? 'bg-primary-500 text-white' : 'bg-surface-200 hover:bg-surface-300'}`}
				onclick={() => editor.chain().focus().toggleItalic().run()}
				title="기울임"
			>
				<em>I</em>
			</button>
			<button
				type="button"
				class={`px-2 py-1 text-sm rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-primary-500 text-white' : 'bg-surface-200 hover:bg-surface-300'}`}
				onclick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				title="제목 1"
			>
				H1
			</button>
			<button
				type="button"
				class={`px-2 py-1 text-sm rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-primary-500 text-white' : 'bg-surface-200 hover:bg-surface-300'}`}
				onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				title="제목 2"
			>
				H2
			</button>
			<button
				type="button"
				class={`px-2 py-1 text-sm rounded ${editor.isActive('bulletList') ? 'bg-primary-500 text-white' : 'bg-surface-200 hover:bg-surface-300'}`}
				onclick={() => editor.chain().focus().toggleBulletList().run()}
				title="목록"
			>
				•
			</button>
			<button
				type="button"
				class={`px-2 py-1 text-sm rounded ${editor.isActive('blockquote') ? 'bg-primary-500 text-white' : 'bg-surface-200 hover:bg-surface-300'}`}
				onclick={() => editor.chain().focus().toggleBlockquote().run()}
				title="인용"
			>
				"
			</button>
		</div>
	{/if}

	<!-- Editor content -->
	<div 
		bind:this={editorElement} 
		class="tiptap-content min-h-96"
	></div>
	
	<!-- 에디터가 로드되지 않았을 때 폴백 -->
	{#if !editor}
		<div class="p-4 text-surface-500 min-h-96 flex items-center justify-center">
			에디터를 로드 중입니다...
		</div>
	{/if}
</div>

<style>
	:global(.tiptap-content .ProseMirror) {
		outline: none;
		min-height: 200px;
		padding: 1rem;
	}

	:global(.tiptap-content .ProseMirror p.is-editor-empty:first-child::before) {
		content: attr(data-placeholder);
		float: left;
		color: rgb(var(--color-surface-500));
		pointer-events: none;
		height: 0;
	}

	:global(.tiptap-content .ProseMirror h1) {
		font-size: 1.875rem;
		font-weight: 700;
		margin: 1rem 0 0.5rem 0;
		color: rgb(var(--color-primary-500));
	}

	:global(.tiptap-content .ProseMirror h2) {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 1rem 0 0.5rem 0;
		color: rgb(var(--color-primary-500));
	}

	:global(.tiptap-content .ProseMirror h3) {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 1rem 0 0.5rem 0;
		color: rgb(var(--color-primary-500));
	}

	:global(.tiptap-content .ProseMirror ul, .tiptap-content .ProseMirror ol) {
		padding-left: 1.5rem;
		margin: 0.5rem 0;
	}

	:global(.tiptap-content .ProseMirror blockquote) {
		border-left: 4px solid rgb(var(--color-primary-500));
		padding-left: 1rem;
		margin: 1rem 0;
		background-color: rgb(var(--color-surface-100) / 0.5);
	}

	:global(.tiptap-content .ProseMirror pre) {
		background-color: rgb(var(--color-surface-100));
		border: 1px solid rgb(var(--color-surface-300));
		border-radius: 0.375rem;
		padding: 1rem;
		margin: 1rem 0;
		overflow-x: auto;
	}

	:global(.tiptap-content .ProseMirror code) {
		background-color: rgb(var(--color-surface-200));
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-size: 0.875em;
	}

	:global([data-mode='dark'] .tiptap-content .ProseMirror blockquote) {
		background-color: rgb(var(--color-surface-900) / 0.5);
	}

	:global([data-mode='dark'] .tiptap-content .ProseMirror pre) {
		background-color: rgb(var(--color-surface-900));
		border: 1px solid rgb(var(--color-surface-700));
	}

	:global([data-mode='dark'] .tiptap-content .ProseMirror code) {
		background-color: rgb(var(--color-surface-800));
	}
</style>