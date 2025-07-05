<script>
	import DraggableBox from './DraggableBox.svelte';

	let { title = '드롭 존', items = [], onItemsChange = () => {} } = $props();

	let isOver = $state(false);
	let localItems = $state([...items]);

	// props 변경 시 로컬 상태 업데이트
	$effect(() => {
		localItems = [...items];
	});

	function handleDragOver(/** @type {DragEvent} */ e) {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
		isOver = true;
	}

	function handleDragLeave() {
		isOver = false;
	}

	function handleDrop(/** @type {DragEvent} */ e) {
		e.preventDefault();
		isOver = false;
		console.log('Drop event triggered');

		try {
			const jsonData = e.dataTransfer.getData('application/json');
			console.log('Retrieved data from dataTransfer:', jsonData);
			
			if (!jsonData) {
				console.error('No data found in dataTransfer');
				return;
			}
			
			const data = JSON.parse(jsonData);
			console.log('Parsed data:', data);

			// 이미 존재하는 아이템인지 확인
			if (!localItems.find((item) => item.id === data.id)) {
				localItems = [...localItems, data];
				onItemsChange(localItems);
				console.log('Item added to zone:', data.id);
			} else {
				console.log('Item already exists in zone:', data.id);
			}
		} catch (error) {
			console.error('Drop failed:', error);
		}
	}

	function handleRemove(id) {
		localItems = localItems.filter((item) => item.id !== id);
		onItemsChange(localItems);
	}
</script>

<div
	class={[
		'card p-6 min-h-[300px] transition-all duration-200',
		isOver ? 'preset-filled-primary-50-950 ring-2 ring-primary-500' : 'preset-filled-surface-50-950'
	].join(' ')}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	<h3 class="h4 font-bold mb-4">{title}</h3>

	{#if localItems.length === 0}
		<div class="flex items-center justify-center h-48 text-surface-600-300">
			<div class="text-center">
				<svg
					class="w-16 h-16 mx-auto mb-4 opacity-30"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
				>
					<path d="M12 2v20M2 12h20" stroke-width="2" stroke-linecap="round" />
				</svg>
				<p>여기에 아이템을 드래그해서 놓으세요</p>
			</div>
		</div>
	{:else}
		<div class="space-y-3">
			{#each localItems as item (item.id)}
				<DraggableBox
					id={item.id}
					content={item.content}
					class="preset-filled-surface-200-800"
					onRemove={handleRemove}
				/>
			{/each}
		</div>
	{/if}
</div>
