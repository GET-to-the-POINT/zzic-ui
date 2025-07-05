<script>
	import { onMount } from 'svelte';
	
	let isDragging = $state(false);
	let draggedId = $state(null);
	let mouseX = $state(0);
	let mouseY = $state(0);
	let isOverCanvas = $state(false);

	// 스티커 데이터
	let stickers = $state([
		{ id: 1, emoji: '🌟', color: 'bg-yellow-500' },
		{ id: 2, emoji: '💖', color: 'bg-pink-500' },
		{ id: 3, emoji: '🚀', color: 'bg-blue-500' },
		{ id: 4, emoji: '🔥', color: 'bg-red-500' },
		{ id: 5, emoji: '🌈', color: 'bg-purple-500' }
	]);

	// 캔버스에 배치된 스티커들
	let canvasStickers = $state([]);
	
	onMount(() => {
		console.log('Sticker page mounted!');
		console.log('Stickers:', stickers);
	});

	function handleDragStart(/** @type {DragEvent} */ e, id) {
		console.log('Drag started for sticker:', id);
		isDragging = true;
		draggedId = id;

		if (!e.dataTransfer) return;

		// 빈 이미지로 기본 드래그 이미지 숨기기
		const emptyImg = new Image();
		emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
		e.dataTransfer.setDragImage(emptyImg, 0, 0);
		
		// 드래그 데이터 설정
		e.dataTransfer.effectAllowed = 'copy';
		const sticker = stickers.find(s => s.id === id);
		if (sticker) {
			e.dataTransfer.setData('application/json', JSON.stringify(sticker));
		}
	}

	function handleDragEnd() {
		console.log('Drag ended');
		// 드롭이 완료될 때까지 약간의 딜레이를 줍니다
		setTimeout(() => {
			isDragging = false;
			draggedId = null;
		}, 100);
	}

	function handleMouseMove(/** @type {MouseEvent} */ e) {
		mouseX = e.clientX;
		mouseY = e.clientY;
	}

	function handleCanvasDragOver(/** @type {DragEvent} */ e) {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
		isOverCanvas = true;
	}

	function handleCanvasDragLeave() {
		isOverCanvas = false;
	}

	function handleCanvasDrop(/** @type {DragEvent} */ e) {
		e.preventDefault();
		isOverCanvas = false;
		console.log('Drop on canvas');
		
		if (!e.dataTransfer) {
			console.error('dataTransfer is null');
			return;
		}

		try {
			const data = e.dataTransfer.getData('application/json');
			console.log('Retrieved data:', data);
			
			if (data) {
				const sticker = JSON.parse(data);
				// 캔버스 내 상대 위치 계산
				const rect = e.currentTarget.getBoundingClientRect();
				const x = e.clientX - rect.left - 40; // 40은 스티커 반경
				const y = e.clientY - rect.top - 40;

				canvasStickers = [...canvasStickers, {
					...sticker,
					x,
					y,
					uniqueId: Date.now() + Math.random()
				}];
				console.log('Sticker added to canvas:', sticker);
			} else {
				console.log('No data in dataTransfer');
			}
		} catch (error) {
			console.error('Drop failed:', error);
		}
	}

	// 드래그 가능하게 만드는 액션
	function makeDraggable(node, { id }) {
		function onDragStart(e) {
			console.log('Action: dragstart!', id);
			handleDragStart(e, id);
		}
		
		function onDragEnd(e) {
			console.log('Action: dragend!');
			handleDragEnd();
		}
		
		function onMouseDown(e) {
			console.log('Action: mousedown!', id);
		}
		
		node.addEventListener('dragstart', onDragStart);
		node.addEventListener('dragend', onDragEnd);
		node.addEventListener('mousedown', onMouseDown);
		
		return {
			destroy() {
				node.removeEventListener('dragstart', onDragStart);
				node.removeEventListener('dragend', onDragEnd);
				node.removeEventListener('mousedown', onMouseDown);
			}
		};
	}
	
	// 드롭 가능하게 만드는 액션
	function makeDroppable(node) {
		function onDragOver(e) {
			handleCanvasDragOver(e);
		}
		
		function onDragLeave(e) {
			handleCanvasDragLeave();
		}
		
		function onDrop(e) {
			handleCanvasDrop(e);
		}
		
		node.addEventListener('dragover', onDragOver);
		node.addEventListener('dragleave', onDragLeave);
		node.addEventListener('drop', onDrop);
		
		return {
			destroy() {
				node.removeEventListener('dragover', onDragOver);
				node.removeEventListener('dragleave', onDragLeave);
				node.removeEventListener('drop', onDrop);
			}
		};
	}

	// 전역 마우스 이동 추적
	$effect(() => {
		function globalDragOver(/** @type {DragEvent} */ e) {
			if (isDragging && e.clientX && e.clientY) {
				mouseX = e.clientX;
				mouseY = e.clientY;
			}
		}

		if (isDragging) {
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('dragover', globalDragOver);

			return () => {
				window.removeEventListener('mousemove', handleMouseMove);
				window.removeEventListener('dragover', globalDragOver);
			};
		}
	});
</script>

<!-- 스티커 스니펫 -->
{#snippet sticker(item)}
	{#if isDragging && draggedId === item.id}
		<!-- 드래그 중인 원본 위치 (구멍) -->
		<div class="w-20 h-20 border-2 border-dashed border-surface-400 rounded-full"></div>
	{:else}
		<!-- 실제 스티커 -->
		<div
			class="w-20 h-20 {item.color} rounded-full shadow-lg cursor-move
			       hover:scale-110 transition-transform duration-200
			       flex items-center justify-center text-3xl"
			draggable="true"
			use:makeDraggable={{ id: item.id }}
			onclick={() => console.log('clicked!', item.id)}
			role="button"
			tabindex="0"
		>
			{item.emoji}
		</div>
	{/if}
{/snippet}

<main>
	<div class="container mx-auto p-8">
		<h1 class="h1 mb-8">스티커 드래그 앤 드롭 테스트</h1>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- 스티커 팔레트 -->
			<div class="space-y-4">
				<h2 class="h2">스티커 팔레트</h2>
				<p class="text-surface-600-300">아래 스티커를 드래그해서 캔버스에 놓으세요</p>
				
				<div class="flex gap-4 flex-wrap p-6 card preset-filled-surface-50-950">
					{#each stickers as item}
						{@render sticker(item)}
					{/each}
				</div>
			</div>

			<!-- 캔버스 영역 -->
			<div class="space-y-4">
				<h2 class="h2">캔버스</h2>
				<p class="text-surface-600-300">스티커를 여기에 놓으세요</p>
				
				<div 
					class={[
						'relative h-[500px] card border-2 transition-all duration-200',
						isOverCanvas 
							? 'border-primary-500 bg-primary-50 dark:bg-primary-950' 
							: 'border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-950'
					].join(' ')}
					use:makeDroppable
				>
					{#if canvasStickers.length === 0}
						<div class="flex items-center justify-center h-full text-surface-600-300">
							<div class="text-center">
								<svg
									class="w-16 h-16 mx-auto mb-4 opacity-30"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
								>
									<rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2" />
									<path d="M8 12h8M12 8v8" stroke-width="2" stroke-linecap="round" />
								</svg>
								<p>스티커를 드래그해서 놓으세요</p>
							</div>
						</div>
					{/if}

					<!-- 캔버스에 배치된 스티커들 -->
					{#each canvasStickers as stickerItem (stickerItem.uniqueId)}
						<div
							class="absolute w-20 h-20 {stickerItem.color} rounded-full shadow-lg
							       flex items-center justify-center text-3xl cursor-move
							       hover:scale-110 transition-transform duration-200"
							style="left: {stickerItem.x}px; top: {stickerItem.y}px;"
						>
							{stickerItem.emoji}
						</div>
					{/each}
				</div>

				{#if canvasStickers.length > 0}
					<button 
						class="btn preset-ghost-error"
						onclick={() => canvasStickers = []}
					>
						캔버스 초기화
					</button>
				{/if}
			</div>
		</div>

		<!-- 드래그 중인 스티커 (마우스 따라다니기) -->
		{#if isDragging}
			{@const draggedSticker = stickers.find((s) => s.id === draggedId)}
			{#if draggedSticker}
				<div
					class="fixed pointer-events-none z-50 opacity-80"
					style="left: {mouseX - 40}px; top: {mouseY - 40}px;"
				>
					<div
						class="w-20 h-20 {draggedSticker.color} rounded-full shadow-2xl
					           flex items-center justify-center text-3xl transform rotate-12"
					>
						{draggedSticker.emoji}
					</div>
				</div>
			{/if}
		{/if}
	</div>
</main>
