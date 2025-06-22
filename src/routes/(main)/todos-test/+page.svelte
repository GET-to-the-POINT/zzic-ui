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

	// 날짜 네비게이션을 위한 데이터 생성 - 백엔드 배열 기준
	const dateNavigation = $derived.by(() => {
		const startDateParam = page.url.searchParams.get('startDate');
		const selectedDate = startDateParam ? new Date(startDateParam) : new Date();

		// 백엔드에서 제공한 weeklyTodos 배열을 기준으로 캘린더 렌더링
		return (data.weeklyTodos).map((weeklyItem) => {
			const itemDate = new Date(weeklyItem.date);
	
			return {
				day: weeklyItem.day,
				dayNumber: weeklyItem.dayNumber,
				href: `?startDate=${encodeURIComponent(weeklyItem.startDate)}&endDate=${encodeURIComponent(weeklyItem.endDate)}`,
				ariaLabel: weeklyItem.ariaLabel,
				selected: itemDate.toDateString() === selectedDate.toDateString(),
				empty: weeklyItem.empty !== false // empty가 명시적으로 false가 아니면 빈 것으로 처리
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
		
		// startDate, endDate 파라미터 유지
		const searchParams = new URLSearchParams();
		const currentStartDate = page.url.searchParams.get('startDate');
		const currentEndDate = page.url.searchParams.get('endDate');
		
		if (currentStartDate) searchParams.set('startDate', currentStartDate);
		if (currentEndDate) searchParams.set('endDate', currentEndDate);
		
		if (searchParams.toString()) {
			url += '&' + searchParams.toString();
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
