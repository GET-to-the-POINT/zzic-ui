<script>
	import TodoItem from './TodoItem.svelte';

	/**
	 * @typedef {import('../../../zzic-api/todo.js').TodoResponse} TodoResponse
	 */

	/** @type {{
	 * todo: TodoResponse,
	 * ghost?: boolean,
	 * draggable?: boolean,
	 * onDragStart?: Function,
	 * onDragEnd?: Function,
	 * onDrop?: Function,
	 * onDragOver?: Function,
	 * onDragLeave?: Function
	 * }} */
	let {
		todo,
		ghost = false,
		draggable = true,
		onDragStart = () => {},
		onDragEnd = () => {},
		onDrop = () => {},
		onDragOver = () => {},
		onDragLeave = () => {}
	} = $props();

	let isDragging = $state(false);
	let isDragOver = $state(false);

	function handleDragStart(/** @type {DragEvent} */ e) {
		if (!draggable) return;

		isDragging = true;
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/json', JSON.stringify(todo));

		// 커스텀 드래그 이미지 생성
		const dragPreview = document.createElement('div');
		dragPreview.className = 'fixed pointer-events-none z-50';
		dragPreview.innerHTML = `
			<div class="card preset-filled-primary-500 p-3 shadow-xl transform rotate-3 opacity-90">
				<h3 class="font-semibold text-white">${todo.title}</h3>
			</div>
		`;
		document.body.appendChild(dragPreview);

		// 드래그 이미지 설정
		e.dataTransfer.setDragImage(dragPreview, 0, 0);

		// 드래그 시작 후 즉시 제거
		setTimeout(() => {
			document.body.removeChild(dragPreview);
		}, 0);

		onDragStart(e, todo);
	}

	function handleDragEnd(/** @type {DragEvent} */ e) {
		isDragging = false;
		onDragEnd(e, todo);
	}

	function handleDragOver(/** @type {DragEvent} */ e) {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
		isDragOver = true;
		onDragOver(e);
	}

	function handleDragLeave(/** @type {DragEvent} */ e) {
		isDragOver = false;
		onDragLeave(e);
	}

	function handleDrop(/** @type {DragEvent} */ e) {
		e.preventDefault();
		isDragOver = false;

		try {
			const draggedTodo = JSON.parse(e.dataTransfer.getData('text/json'));
			onDrop(e, draggedTodo, todo);
		} catch (error) {
			console.error('Failed to parse dragged todo data', error);
		}
	}
</script>

<div
	class={[
		'relative transition-all duration-200',
		ghost && 'opacity-50 cursor-move',
		isDragging && 'opacity-30 scale-95',
		isDragOver && 'ring-2 ring-primary-500 ring-offset-2',
		draggable && 'cursor-move hover:shadow-lg'
	]
		.filter(Boolean)
		.join(' ')}
	{draggable}
	ondragstart={handleDragStart}
	ondragend={handleDragEnd}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	{#if ghost}
		<!-- Ghost 상태일 때는 심플한 뷰 -->
		<div class="card preset-filled-surface-50-950 p-4 border-2 border-dashed border-surface-400">
			<h3 class="font-semibold opacity-60">{todo.title}</h3>
			{#if todo.description}
				<p class="text-xs opacity-50 mt-1">{todo.description}</p>
			{/if}
		</div>
	{:else}
		<!-- 일반 TodoItem -->
		<TodoItem {todo} />
	{/if}

	{#if draggable && !ghost}
		<!-- 드래그 핸들 표시 -->
		<div class="absolute top-2 right-2 opacity-30 hover:opacity-60 pointer-events-none">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
				<circle cx="4" cy="4" r="1.5" />
				<circle cx="12" cy="4" r="1.5" />
				<circle cx="4" cy="8" r="1.5" />
				<circle cx="12" cy="8" r="1.5" />
				<circle cx="4" cy="12" r="1.5" />
				<circle cx="12" cy="12" r="1.5" />
			</svg>
		</div>
	{/if}
</div>
