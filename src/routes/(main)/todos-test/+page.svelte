<script>
	import Clock from '@lucide/svelte/icons/clock';
	import Plus from '@lucide/svelte/icons/plus';
	import Check from '@lucide/svelte/icons/check';
	import Square from '@lucide/svelte/icons/square';
	import AlertCircle from '@lucide/svelte/icons/alert-circle';
	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import noHaveTodo from '$lib/assets/no-have-todo.png';

	let { data } = $props();
	
	// TODO: [BACKEND] 이 로직은 백엔드에서 구현되어야 합니다.
	// 현재는 프론트엔드에서 임시로 계산하고 있으나, 이는 성능과 정확성 측면에서 문제가 될 수 있습니다.
	// 백엔드 API에서 날짜별 todo 개수 정보를 포함한 캐러셀 데이터를 직접 제공해야 합니다.
	/**
	 * 임시 함수: 날짜별 todo 개수를 계산합니다.
	 * @param {any[]} todos - todo 배열
	 * @returns {Map<string, number>} 날짜별 todo 개수 맵
	 */
	function calculateTodoCountsByDate(todos) {
		const todosByDate = new Map();
		if (todos?.length) {
			for (const todo of todos) {
				if (todo.dueDate) {
					const count = todosByDate.get(todo.dueDate) || 0;
					todosByDate.set(todo.dueDate, count + 1);
				}
			}
		}
		return todosByDate;
	}
	
	// 날짜 네비게이션을 위한 데이터 생성 (오늘 기준 ±3일)
	const today = new Date();
	const dateNavigation = $derived.by(() => {
		const selectedDateParam = page.url.searchParams.get('date');
		const selectedDate = selectedDateParam ? new Date(selectedDateParam) : new Date();
		
		// TODO: [BACKEND] 이 계산 로직을 백엔드로 이전 후 아래 라인을 제거하세요.
		const todoCountsByDate = calculateTodoCountsByDate(data?.weeklyTodos?.content);
		
		return Array.from({ length: 7 }, (_, i) => {
			const date = new Date(today);
			date.setDate(today.getDate() + (i - 3));
			const isoDate = date.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }) + 'T00:00:00+09:00';
			
			// TODO: [BACKEND] 백엔드에서 empty 필드를 직접 제공하면 아래 계산 로직을 제거하세요.
			const todoCount = todoCountsByDate.get(isoDate) || 0;
			
			return {
				date,
				day: date.toLocaleDateString('ko-KR', { weekday: 'short' }),
				dayNumber: date.getDate(),
				isoDate,
				href: `?date=${encodeURIComponent(isoDate)}`,
				ariaLabel: date.toLocaleDateString('ko-KR', { 
					weekday: 'long', 
					year: 'numeric', 
					month: 'long', 
					day: 'numeric' 
				}),
				selected: date.toDateString() === selectedDate.toDateString(),
				// TODO: [BACKEND] 백엔드에서 empty 필드를 직접 제공하면 이 계산을 제거하세요.
				empty: todoCount === 0
			};
		});
	});

	/**
	 * @param {string} dateStr - YYYY-MM-DD 또는 YYYY-MM-DDTHH:mm:ss+09:00 형식
	 */
	function formatDisplayDate(dateStr) {
		try {
			const today = new Date();
			// 타임존 정보가 없으면 한국 시간 정오로 처리
			const dateToCompare = dateStr.includes('T') ? dateStr : dateStr + 'T12:00:00+09:00';
			const date = new Date(dateToCompare);
			const diffTime = date.getTime() - today.getTime();
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			// 상대적 날짜 표시 (-7일 ~ +7일)
			if (Math.abs(diffDays) <= 7) {
				const rtf = new Intl.RelativeTimeFormat('ko-KR', { numeric: 'auto' });
				return rtf.format(diffDays, 'day');
			}

			// 절대적 날짜 표시
			return new Intl.DateTimeFormat('ko-KR', {
				month: 'short',
				day: 'numeric'
			}).format(date);
		} catch {
			return dateStr;
		}
	}

	/**
	 * Form enhance 핸들러
	 */
	const handleEnhance = () => {
		return async (/** @type {{ result: any }} */ { result }) => {
			if (result.type === 'redirect') {
				await invalidateAll();
			}
		};
	}

	/**
	 * Todo 업데이트 액션 URL 생성
	 * @param {number} todoId
	 */
	function getUpdateAction(todoId) {
		let url = `/todos/${todoId}?/update`;
		
		if (page.url.search) {
			url += '&' + page.url.search.substring(1);
		}
		
		return url;
	}
</script>

<!-- 메인 컨테이너 -->
<main class="min-h-screen">
	<!-- 상단 날짜 네비게이션 -->
	<div class="p-4 bg-surface-500">
		<div class="grid grid-cols-7 gap-2">
			{#each dateNavigation as dateItem}
				<a
					href={dateItem.href}
					class={[
						'btn relative',
						dateItem.selected 
							? 'preset-filled-primary-500' 
							: 'preset-filled-surface-50-950',
						!dateItem.empty && 'after:content-[""] after:absolute after:inset-x-0 after:bottom-0 after:h-2 after:bg-secondary-500'
					]}
					aria-label={dateItem.ariaLabel}
					aria-current={dateItem.selected ? 'page' : undefined}
				>
					<div class="flex flex-col items-center justify-center gap-1 p-2">
						<div class="text-xs font-semibold">
							{dateItem.day}
						</div>
						<div class="text-xs font-semibold">
							{dateItem.dayNumber}
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>

	<!-- TODO 리스트 섹션 -->
	<div class="space-y-4 p-4">
		<!-- 헤더 -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold">TODO LIST</h1>
			<button type="button" class="btn-icon">
				<EllipsisVertical size={16} />
			</button>
		</div>

		<!-- 새 할일 추가 버튼 (nojs 환경에서만 노출) -->
		<noscript>
			<button type="button" class="btn preset-filled-secondary-500 w-full">
				<Plus size={16}/>
				새 할일 추가
			</button>
		</noscript>

		<!-- TODO 아이템들 -->
		<div class="space-y-4">
			{#if !data?.selectedDateTodos?.empty}
				{#each data.selectedDateTodos.content as todo (todo.id)}
					{@const isCompleted = todo.statusId === 1}
					<div class={['card p-4', isCompleted ? 'preset-filled-primary-50-950' : 'preset-filled-surface-500']}>
						<div class="flex items-start gap-3">
							<!-- 체크박스 -->
							<form action={getUpdateAction(todo.id)} method="POST" use:enhance={handleEnhance}>
								<button 
									type="submit"
									name="statusId"
									value={todo.statusId === 1 ? 0 : 1}
									class="mt-1 btn-icon {isCompleted ? 'preset-filled-primary-500' : 'preset-filled-surface-500'}"
								>
									{#if todo.statusId === 1}
										<!-- 완료 상태 -->
										<Check size={16} />
									{:else if todo.statusId === 2}
										<!-- 기간초과 상태 -->
										<AlertCircle size={16} />
									{:else}
										<!-- 미완료 상태 (진행중) -->
										<Square size={16} />
									{/if}
								</button>
							</form>

							<!-- 컨텐츠 -->
							<div class="flex-1">
								<!-- 제목과 설명 -->
								<div class="mb-4">
									<h3 class={['text-base font-semibold', isCompleted && 'line-through']}>
										{todo.title}
									</h3>
									<p class={['text-sm font-light mt-2', isCompleted && 'line-through']}>
										{todo.description}
									</p>
								</div>

								<!-- 태그들과 시간 -->
								<div class="flex flex-wrap items-center gap-1.5">
									<!-- 카테고리 -->
									<span class="badge text-xs preset-outlined-primary-500">
										{todo.categoryName || '미분류'}
									</span>

									<!-- 시간 -->
									{#if todo.dueDate}
										<div class="badge text-xs flex items-center gap-1">
											<Clock class="w-3 h-3" />
											{formatDisplayDate(todo.dueDate)}
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
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<img src={noHaveTodo} alt="할 일이 없습니다" class="mx-auto w-1/2" />
			{/if}
		</div>
	</div>

</main>
