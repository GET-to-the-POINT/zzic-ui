<script>
	import { Check, Clock, Edit, Pin, Square, Trash2 } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toaster } from '$lib/utils/toast';

	/**
	 * @typedef {import('../../../zzic-api/todo.js').TodoResponse} TodoResponse
	 */

	/** @type {{ todo: TodoResponse }} */
	let { todo } = $props();

	// DOM 요소 참조
	let containerElement = $state(/** @type {HTMLDivElement | null} */ (null));

	// 스와이프 상태 관리
	let startX = $state(0);
	let currentX = $state(0);
	let translateX = $state(0);
	let isDragging = $state(false);
	let isLeftRevealed = $state(false); // 왼쪽 스와이프 (수정/삭제 버튼)
	let isRightRevealed = $state(false); // 오른쪽 스와이프 (고정 버튼)

	// 할일 상태 관리
	let isPinned = $state(todo.isPinned || false);
	let hasSwipedThisSession = $state(false);
	let preventClick = $state(false);

	// 스와이프 설정
	const SWIPE_THRESHOLD = 80;
	const ACTION_BUTTON_WIDTH = 120;
	const PIN_BUTTON_WIDTH = 60;

	// 파생 상태
	const isCompleted = $derived(todo.complete);

	// Form enhance 핸들러
	const handleEnhance = () => {
		return async (/** @type {any} */ { result }) => {
			if (result.type === 'success') {
				await invalidateAll();
				toaster.success({ title: '할 일이 성공적으로 업데이트되었습니다!' });
			}
		};
	};

	// 스와이프 상태 초기화
	function initSwipeState() {
		hasSwipedThisSession = false;
		preventClick = false;
	}

	// 스와이프 종료 처리
	function finishSwipe(/** @type {number} */ deltaX) {
		if (deltaX < -SWIPE_THRESHOLD) {
			translateX = -ACTION_BUTTON_WIDTH;
			isLeftRevealed = true;
			isRightRevealed = false;
		} else if (deltaX > SWIPE_THRESHOLD) {
			translateX = PIN_BUTTON_WIDTH;
			isRightRevealed = true;
			isLeftRevealed = false;
		} else {
			translateX = 0;
			isLeftRevealed = false;
			isRightRevealed = false;
		}
	}

	// 터치 이벤트 핸들러
	const handleTouchStart = (/** @type {TouchEvent} */ e) => {
		startX = e.touches[0].clientX;
		currentX = startX;
		isDragging = true;
		initSwipeState();
	};

	const handleTouchMove = (/** @type {TouchEvent} */ e) => {
		if (!isDragging) return;

		e.preventDefault();
		currentX = e.touches[0].clientX;
		const deltaX = currentX - startX;

		if (deltaX < 0) {
			translateX = Math.max(deltaX, -ACTION_BUTTON_WIDTH);
			isRightRevealed = false;
		} else if (deltaX > 0) {
			translateX = Math.min(deltaX, PIN_BUTTON_WIDTH);
			isLeftRevealed = false;
		}
	};

	const handleTouchEnd = (/** @type {TouchEvent} */ e) => {
		if (!isDragging) return;
		isDragging = false;

		const deltaX = currentX - startX;

		if (Math.abs(deltaX) > 5) {
			e.preventDefault();
			hasSwipedThisSession = true;
			preventClick = true;
			setTimeout(() => (preventClick = false), 100);
		}

		finishSwipe(deltaX);
	};

	// 마우스 이벤트 핸들러
	const handleMouseDown = (/** @type {MouseEvent} */ e) => {
		startX = e.clientX;
		currentX = startX;
		isDragging = true;
		initSwipeState();
		e.preventDefault();
		e.stopPropagation();
	};

	const handleMouseMove = (/** @type {MouseEvent} */ e) => {
		if (!isDragging) return;

		currentX = e.clientX;
		const deltaX = currentX - startX;

		if (deltaX < 0) {
			translateX = Math.max(deltaX, -ACTION_BUTTON_WIDTH);
			isRightRevealed = false;
		} else if (deltaX > 0) {
			translateX = Math.min(deltaX, PIN_BUTTON_WIDTH);
			isLeftRevealed = false;
		}
	};

	const handleMouseUp = () => {
		if (!isDragging) return;
		isDragging = false;

		const deltaX = currentX - startX;

		if (Math.abs(deltaX) > 5) {
			hasSwipedThisSession = true;
			preventClick = true;
			setTimeout(() => (preventClick = false), 100);
		}

		finishSwipe(deltaX);
	};

	// 액션 버튼 상태 초기화
	function resetActionButtons() {
		translateX = 0;
		isLeftRevealed = false;
		isRightRevealed = false;
		hasSwipedThisSession = false;
	}

	// 클릭 이벤트 처리
	const handleClick = (/** @type {MouseEvent} */ e) => {
		if (preventClick || hasSwipedThisSession || isLeftRevealed || isRightRevealed) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	};

	// 키보드 이벤트 처리
	const handleKeydown = (/** @type {KeyboardEvent} */ e) => {
		if ((e.key === 'Enter' || e.key === ' ') && (isLeftRevealed || isRightRevealed)) {
			resetActionButtons();
			e.preventDefault();
		}
	};

	// 외부 클릭 처리
	const handleClickOutside = (/** @type {MouseEvent} */ e) => {
		if (isDragging || preventClick) return;

		if (
			(isLeftRevealed || isRightRevealed) &&
			containerElement &&
			!containerElement.contains(/** @type {Node} */ (e.target))
		) {
			resetActionButtons();
		}
	};

	// 액션 핸들러들
	const handleEdit = () => {
		window.location.href = `/todos/${todo.id}/update`;
	};

	const handlePinSubmit = () => {
		resetActionButtons();
	};

	const handlePinEnhance = () => {
		return async (/** @type {any} */ { result }) => {
			if (result.type === 'success') {
				isPinned = !isPinned;
				await invalidateAll();
				toaster.success({
					title: isPinned ? '할일이 고정되었습니다!' : '할일 고정이 해제되었습니다!'
				});
			} else if (result.type === 'failure') {
				toaster.error({ title: '고정 처리 중 오류가 발생했습니다.' });
			}
		};
	};

	const handleDelete = async () => {
		if (!confirm('정말로 이 할 일을 삭제하시겠습니까?')) {
			resetActionButtons();
			return;
		}

		try {
			const response = await fetch(`/todos/${todo.id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				await invalidateAll();
				toaster.success({ title: '할 일이 삭제되었습니다!' });
			} else {
				toaster.error({ title: '삭제에 실패했습니다.' });
			}
		} catch (error) {
			toaster.error({ title: '삭제 중 오류가 발생했습니다.' });
		} finally {
			resetActionButtons();
		}
	};
</script>

<svelte:window
	onmousemove={handleMouseMove}
	onmouseup={handleMouseUp}
	onclick={handleClickOutside}
/>

<div class="card relative overflow-hidden" style:view-transition-name="{todo.id}-todo">
	<!-- 왼쪽 스와이프 액션 버튼들 (수정/삭제) -->
	<div class="absolute top-0 right-0 h-full flex">
		<!-- 수정 버튼 -->
		<button
			type="button"
			class="w-15 h-full preset-filled-primary-500 flex items-center justify-center"
			onclick={handleEdit}
			aria-label="할 일 수정"
		>
			<Edit size={20} />
		</button>

		<!-- 삭제 버튼 -->
		<button
			type="button"
			class="w-15 h-full preset-filled-error-500 flex items-center justify-center"
			onclick={handleDelete}
			aria-label="할 일 삭제"
		>
			<Trash2 size={20} />
		</button>
	</div>

	<!-- 오른쪽 스와이프 액션 버튼 (고정) -->
	<div class="absolute top-0 left-0 h-full flex">
		<form
			action="/todos/{todo.id}/pin"
			method="POST"
			use:enhance={handlePinEnhance}
			onsubmit={handlePinSubmit}
		>
			<button
				type="submit"
				class="w-15 h-full {isPinned
					? 'preset-filled-error-500'
					: 'preset-filled-warning-500'} flex items-center justify-center"
				aria-label={isPinned ? '할 일 고정 해제' : '할 일 고정'}
			>
				<Pin size={20} class={isPinned ? 'rotate-45' : ''} />
			</button>
		</form>
	</div>

	<!-- 메인 컨텐츠 (앞쪽) -->
	<div
		bind:this={containerElement}
		class={[
			'transition-transform duration-200 ease-out',
			isCompleted ? 'preset-filled-primary-50-950' : 'preset-filled-surface-50-950'
		]}
		style="transform: translateX({translateX}px)"
		ontouchstart={handleTouchStart}
		ontouchmove={handleTouchMove}
		ontouchend={handleTouchEnd}
		onmousedown={handleMouseDown}
		onclick={handleClick}
		onkeydown={handleKeydown}
		role="button"
		tabindex="0"
	>
		<div class="flex items-start gap-2">
			<!-- 체크박스와 핀 아이콘 -->
			<div class="pt-4 pl-4 flex flex-col items-center gap-1">
				<form action={`/todos/${todo.id}/update`} method="POST" use:enhance={handleEnhance}>
					<button
						type="submit"
						name="complete"
						value={(!todo.complete).toString()}
						class="btn-icon {isCompleted
							? 'preset-filled-primary-500'
							: 'preset-filled-surface-50-950'}"
					>
						{#if todo.complete}
							<!-- 완료 상태 -->
							<Check size={16} />
						{:else}
							<!-- 미완료 상태 (진행중) -->
							<Square size={16} />
						{/if}
					</button>
				</form>

				<!-- 핀 아이콘 (pinned 상태일 때만 표시) -->
				{#if isPinned}
					<Pin size={12} />
				{/if}
			</div>

			<!-- 컨텐츠 -->
			<a href={`/todos/${todo.id}`} class="pl-2 py-4 pr-4 flex-1" onclick={handleClick}>
				<!-- 제목과 설명 -->
				<div class="flex items-start gap-2">
					<div class="flex-1">
						<h3 class={['font-semibold', isCompleted && 'line-through']}>
							{todo.title}
						</h3>
						<p class={['text-xs', isCompleted && 'line-through']}>
							{todo.description}
						</p>
					</div>
				</div>

				<!-- 태그들과 시간 -->
				<div class="flex flex-wrap items-center gap-1.5">
					<!-- 카테고리 -->
					<span class="badge text-xs preset-outlined-primary-500">
						{todo.categoryName || '미분류'}
					</span>

					<!-- 시간 -->
					{#if todo.time}
						<div class="badge text-xs flex items-center gap-1">
							<Clock class="w-3 h-3" />
							{todo.time.slice(0, 5)}
						</div>
					{/if}

					<!-- 태그들 -->
					{#if todo.tags}
						{#each todo.tags as tag}
							<span class="badge text-xs before:content-['#'] before:opacity-70">
								{tag}
							</span>
						{/each}
					{/if}
				</div>
			</a>
		</div>
	</div>
</div>
