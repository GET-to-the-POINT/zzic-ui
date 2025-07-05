<script>
	import DraggableTodoItem from '$lib/components/widgets/todos/DraggableTodoItem.svelte';

	/**
	 * @typedef {import('../../../zzic-api/todo.js').TodoResponse} TodoResponse
	 */

	/** @type {{
	 * todos: TodoResponse[],
	 * title?: string,
	 * onReorder?: Function
	 * }} */
	let { todos = [], title = '할 일 목록', onReorder = () => {} } = $props();

	let items = $state([...todos]);
	let draggedItem = $state(null);
	let draggedIndex = $state(-1);
	let dropTargetIndex = $state(-1);

	// props의 todos가 변경되면 items 업데이트
	$effect(() => {
		items = [...todos];
	});

	function handleDragStart(/** @type {DragEvent} */ e, /** @type {TodoResponse} */ todo) {
		draggedItem = todo;
		draggedIndex = items.findIndex((item) => item.id === todo.id);
		// 드래그 이미지를 숨기기 위해 빈 이미지 설정
		const dragImage = new Image();
		dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
		e.dataTransfer.setDragImage(dragImage, 0, 0);
	}

	function handleDragEnd() {
		// 드롭이 성공했으면 실제로 순서 변경
		if (dropTargetIndex !== -1 && draggedIndex !== -1 && dropTargetIndex !== draggedIndex) {
			const newItems = [...items];
			const [removed] = newItems.splice(draggedIndex, 1);

			// 드래그한 아이템이 원래 위치보다 뒤로 가는 경우 인덱스 조정
			const adjustedIndex = draggedIndex < dropTargetIndex ? dropTargetIndex - 1 : dropTargetIndex;
			newItems.splice(adjustedIndex, 0, removed);

			items = newItems;
			onReorder(newItems);
		}

		// 상태 초기화
		draggedItem = null;
		draggedIndex = -1;
		dropTargetIndex = -1;
	}

	function handleDragOver(/** @type {DragEvent} */ e, /** @type {number} */ index) {
		e.preventDefault();
		if (draggedIndex !== -1 && index !== draggedIndex) {
			dropTargetIndex = index;
		}
	}

	function handleDragLeave() {
		// 컨테이너를 완전히 벗어날 때만 초기화
		setTimeout(() => {
			if (dropTargetIndex !== -1) {
				dropTargetIndex = -1;
			}
		}, 10);
	}

	// 드롭 존 (빈 공간에 드롭할 때)
	let isDropZoneActive = $state(false);

	function handleDropZoneDragOver(/** @type {DragEvent} */ e) {
		e.preventDefault();
		isDropZoneActive = true;
		dropTargetIndex = items.length;
	}

	function handleDropZoneDragLeave() {
		isDropZoneActive = false;
		if (dropTargetIndex === items.length) {
			dropTargetIndex = -1;
		}
	}

	function handleDropZoneDrop(/** @type {DragEvent} */ e) {
		e.preventDefault();
		isDropZoneActive = false;
		// handleDragEnd에서 처리됨
	}
</script>

<section class="card preset-filled-surface-50-950 p-4 space-y-4">
	<h2 class="h4 font-bold">{title}</h2>

	<div class="space-y-2" ondragleave={handleDragLeave}>
		{#each items as todo, index (todo.id)}
			<!-- 드롭 타겟 인디케이터 (위쪽) -->
			{#if draggedItem && dropTargetIndex === index && draggedIndex !== index}
				<div class="h-1 bg-primary-500 rounded-full transition-all duration-200"></div>
			{/if}

			<!-- 드래그 중인 아이템의 원래 위치에 플레이스홀더 표시 -->
			{#if draggedItem && draggedIndex === index}
				<div
					class="border-2 border-dashed border-surface-400 dark:border-surface-600 rounded-lg p-4 opacity-50"
				>
					<div class="h-12 flex items-center justify-center text-surface-600-300">
						<span class="text-sm">원래 위치</span>
					</div>
				</div>
			{:else}
				<div ondragover={(e) => handleDragOver(e, index)}>
					<DraggableTodoItem
						{todo}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
						ghost={draggedItem?.id === todo.id}
					/>
				</div>
			{/if}
		{/each}

		{#if items.length === 0}
			<div class="text-center py-8 text-surface-600-300">
				할 일이 없습니다. 드래그해서 추가하세요.
			</div>
		{/if}

		<!-- 빈 공간 드롭 존 -->
		{#if items.length > 0}
			<!-- 마지막 위치 드롭 인디케이터 -->
			{#if draggedItem && dropTargetIndex === items.length}
				<div class="h-1 bg-primary-500 rounded-full transition-all duration-200"></div>
			{/if}

			<div
				class={[
					'h-20 border-2 border-dashed rounded-lg transition-all',
					isDropZoneActive
						? 'border-primary-500 bg-primary-500/10'
						: 'border-surface-300 dark:border-surface-600'
				].join(' ')}
				ondragover={handleDropZoneDragOver}
				ondragleave={handleDropZoneDragLeave}
				ondrop={handleDropZoneDrop}
			>
				<div class="flex items-center justify-center h-full text-surface-600-300 text-sm">
					여기에 드롭하여 맨 끝에 추가
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	/* 드래그 중일 때 부드러운 애니메이션 */
	:global(.dragging) {
		opacity: 0.5;
	}
</style>
