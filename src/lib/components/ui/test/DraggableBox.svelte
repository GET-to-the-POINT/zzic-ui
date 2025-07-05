<script>
	let { id = '', content = '', class: className = '', onRemove = () => {} } = $props();

	let isDragging = $state(false);
	let isOver = $state(false);
	let mouseX = $state(0);
	let mouseY = $state(0);
	let offsetX = $state(0);
	let offsetY = $state(0);
	let elementRef = $state(/** @type {HTMLDivElement | null} */ (null));

	function handleDragStart(/** @type {DragEvent} */ e) {
		console.log('Drag started for item:', id);
		isDragging = true;

		if (!elementRef || !e.dataTransfer) return;

		// 드래그 시작 시 마우스 오프셋 계산
		const rect = elementRef.getBoundingClientRect();
		offsetX = e.clientX - rect.left;
		offsetY = e.clientY - rect.top;

		// 초기 마우스 위치 설정
		mouseX = e.clientX - offsetX;
		mouseY = e.clientY - offsetY;

		// 빈 이미지 설정
		const emptyImg = new Image();
		emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
		e.dataTransfer.setDragImage(emptyImg, 0, 0);

		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('application/json', JSON.stringify({ id, content }));
		console.log('Data set in dataTransfer:', { id, content });
	}

	function handleDragEnd() {
		isDragging = false;
	}

	function handleDragOver(/** @type {DragEvent} */ e) {
		e.preventDefault();
		isOver = true;
	}

	function handleDragLeave() {
		isOver = false;
	}

	function handleDrop(/** @type {DragEvent} */ e) {
		e.preventDefault();
		isOver = false;
	}

	function handleMouseMove(/** @type {MouseEvent} */ e) {
		mouseX = e.clientX - offsetX;
		mouseY = e.clientY - offsetY;
	}

	function handleDrag(/** @type {DragEvent} */ e) {
		// 드래그 중 마우스 위치 업데이트
		if (e.clientX && e.clientY) {
			mouseX = e.clientX - offsetX;
			mouseY = e.clientY - offsetY;
		}
	}

	// 드래그 중일 때 전역 dragover 이벤트 추적
	$effect(() => {
		function globalDragOver(/** @type {DragEvent} */ e) {
			if (isDragging && e.clientX && e.clientY) {
				mouseX = e.clientX - offsetX;
				mouseY = e.clientY - offsetY;
			}
		}

		if (isDragging) {
			document.addEventListener('dragover', globalDragOver);
			return () => {
				document.removeEventListener('dragover', globalDragOver);
			};
		}
	});
</script>

{#if isDragging}
	<!-- 드래그 중일 때 빈 공간 (점선 테두리) -->
	<div class="relative">
		<div
			class="card p-4 border-2 border-dashed border-surface-400 dark:border-surface-600 bg-transparent"
		>
			<div class="h-16 opacity-0"><!-- 높이 유지용 --></div>
		</div>
	</div>
{:else}
	<!-- 실제 컴포넌트 -->
	<div class="relative">
		<div
			bind:this={elementRef}
			class={[
				'relative card p-4 cursor-move transition-all duration-200',
				isOver && 'ring-2 ring-warning-500',
				className
			]
				.filter(Boolean)
				.join(' ')}
			draggable="true"
			ondragstart={handleDragStart}
			ondrag={handleDrag}
			ondragend={handleDragEnd}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
			onmousemove={handleMouseMove}
			role="button"
			tabindex="0"
		>
			<!-- 삭제 버튼 -->
			<button
				class="absolute top-2 right-2 btn-icon btn-sm preset-ghost-error opacity-60 hover:opacity-100"
				onclick={() => onRemove(id)}
				aria-label="삭제"
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
					<path
						d="M2.5 2.5l11 11M13.5 2.5l-11 11"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>
			</button>

			<!-- 드래그 핸들 -->
			<div class="absolute top-2 left-2 opacity-30">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
					<circle cx="5" cy="5" r="1.5" />
					<circle cx="15" cy="5" r="1.5" />
					<circle cx="5" cy="10" r="1.5" />
					<circle cx="15" cy="10" r="1.5" />
					<circle cx="5" cy="15" r="1.5" />
					<circle cx="15" cy="15" r="1.5" />
				</svg>
			</div>

			<!-- 콘텐츠 -->
			<div class="mt-6">
				{@html content}
			</div>
		</div>
	</div>
{/if}

<!-- 드래그 중인 요소 (마우스 따라다니기) -->
{#if isDragging}
	<div class="fixed pointer-events-none z-50 opacity-80" style="left: {mouseX}px; top: {mouseY}px;">
		<div class={['card p-4', className].filter(Boolean).join(' ')}>
			<!-- 삭제 버튼 (드래그 중에도 표시) -->
			<div class="absolute top-2 right-2 opacity-60">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
					<path
						d="M2.5 2.5l11 11M13.5 2.5l-11 11"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>
			</div>

			<!-- 드래그 핸들 (드래그 중에도 표시) -->
			<div class="absolute top-2 left-2 opacity-30">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
					<circle cx="5" cy="5" r="1.5" />
					<circle cx="15" cy="5" r="1.5" />
					<circle cx="5" cy="10" r="1.5" />
					<circle cx="15" cy="10" r="1.5" />
					<circle cx="5" cy="15" r="1.5" />
					<circle cx="15" cy="15" r="1.5" />
				</svg>
			</div>

			<!-- 콘텐츠 -->
			<div class="mt-6">
				{@html content}
			</div>
		</div>
	</div>
{/if}
