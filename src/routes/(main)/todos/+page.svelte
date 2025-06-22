<script>
	import TodoDialog, { openTodoDialog } from '$lib/components/ui/todo/TodoDialog.svelte';
	import TodoItem from '$lib/components/ui/todo/TodoItem.svelte';
	import TodoFilter from '$lib/components/ui/todo/TodoFilter.svelte';
	import TodoStats from '$lib/components/ui/todo/TodoStats.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import Clock from '@lucide/svelte/icons/clock';
	import Check from '@lucide/svelte/icons/check';
	import Square from '@lucide/svelte/icons/square';
	import AlertCircle from '@lucide/svelte/icons/alert-circle';
	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { goto } from '$app/navigation';
	import noHaveTodo from '$lib/assets/no-have-todo.png';

	const { data } = $props();
	const { todoPage, todoStatisticsResponse, selectedDateTodos, weeklyTodos, currentTab } =
		$derived(data);

	// 탭 상태 관리
	let activeTab = $state(currentTab || 'full');

	// 탭 변경 함수
	function switchTab(tab) {
		activeTab = tab;
		const url = new URL($page.url);
		url.searchParams.set('tab', tab);
		goto(url.toString(), { replaceState: true });
	}

	// 심플뷰용 날짜 관련 로직 (todos-test에서 가져옴)
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

	// 날짜 네비게이션 데이터
	const today = new Date();
	const dateNavigation = $derived.by(() => {
		const selectedDateParam = $page.url.searchParams.get('date');
		const selectedDate = selectedDateParam ? new Date(selectedDateParam) : new Date();

		const todoCountsByDate = calculateTodoCountsByDate(weeklyTodos?.content);

		return Array.from({ length: 7 }, (_, i) => {
			const date = new Date(today);
			date.setDate(today.getDate() + (i - 3));
			const isoDate =
				date.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }) + 'T00:00:00+09:00';

			const todoCount = todoCountsByDate.get(isoDate) || 0;

			return {
				date,
				day: date.toLocaleDateString('ko-KR', { weekday: 'short' }),
				dayNumber: date.getDate(),
				isoDate,
				href: `?date=${encodeURIComponent(isoDate)}&tab=simple`,
				ariaLabel: date.toLocaleDateString('ko-KR', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				}),
				selected: date.toDateString() === selectedDate.toDateString(),
				empty: todoCount === 0
			};
		});
	});

	function formatDisplayDate(dateStr) {
		try {
			const today = new Date();
			const dateToCompare = dateStr.includes('T') ? dateStr : dateStr + 'T12:00:00+09:00';
			const date = new Date(dateToCompare);
			const diffTime = date.getTime() - today.getTime();
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			if (Math.abs(diffDays) <= 7) {
				const rtf = new Intl.RelativeTimeFormat('ko-KR', { numeric: 'auto' });
				return rtf.format(diffDays, 'day');
			}

			return new Intl.DateTimeFormat('ko-KR', {
				month: 'short',
				day: 'numeric'
			}).format(date);
		} catch {
			return dateStr;
		}
	}

	function formatDateTime(dateStr) {
		try {
			const dateToCompare = dateStr.includes('T') ? dateStr : dateStr + 'T12:00:00+09:00';
			const date = new Date(dateToCompare);
			return new Intl.DateTimeFormat('ko-KR', {
				hour: 'numeric',
				minute: '2-digit',
				hour12: true
			}).format(date);
		} catch {
			return '';
		}
	}
</script>

<main class="p-4 space-y-4">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl">할 일 관리</h2>
			<p class="text-sm">할일을 체계적으로 관리하고 반복 일정을 설정하세요</p>
		</div>
		<button class="btn preset-filled-primary-500" onclick={openTodoDialog} type="button">
			<Plus class="w-4 h-4 mr-2" />
			새 할 일
		</button>
	</div>

	<TodoDialog />

	<!-- 탭 네비게이션 -->
	<div class="border-b border-surface-300-600">
		<nav class="flex space-x-8">
			<button
				class="btn {activeTab === 'full'
					? 'border-b-2 border-primary-500 text-primary-600-300'
					: 'text-surface-600-300 hover:text-surface-900-100'} px-0 py-3"
				onclick={() => switchTab('full')}
			>
				전체 관리
			</button>
			<button
				class="btn {activeTab === 'simple'
					? 'border-b-2 border-primary-500 text-primary-600-300'
					: 'text-surface-600-300 hover:text-surface-900-100'} px-0 py-3"
				onclick={() => switchTab('simple')}
			>
				심플 뷰
			</button>
		</nav>
	</div>

	<!-- 전체 관리 탭 -->
	{#if activeTab === 'full'}
		<div class="space-y-4">
			<TodoStats {todoStatisticsResponse} />
			<TodoFilter />

			<div class="space-y-2">
				{#each todoPage.content as todoResponse (todoResponse.id)}
					<TodoItem {todoResponse} />
				{/each}
			</div>
		</div>
	{/if}

	<!-- 심플 뷰 탭 -->
	{#if activeTab === 'simple'}
		<div class="space-y-4">
			<!-- 날짜 네비게이션 -->
			<div class="preset-filled-surface-100-800 rounded-lg p-4">
				<div class="grid grid-cols-7 gap-1">
					{#each dateNavigation as dateItem}
						<a
							href={dateItem.href}
							class="btn w-full h-16 p-2 text-center relative {dateItem.selected
								? 'preset-filled-primary-500'
								: 'preset-tonal-surface'} {dateItem.empty ? 'opacity-50' : ''}"
							aria-label={dateItem.ariaLabel}
						>
							<div class="text-xs text-surface-600-300">{dateItem.day}</div>
							<div class="text-lg font-medium">{dateItem.dayNumber}</div>
							{#if !dateItem.empty}
								<div class="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full"></div>
							{/if}
						</a>
					{/each}
				</div>
			</div>

			<!-- 선택된 날짜의 할 일 목록 -->
			<div class="space-y-3">
				{#if selectedDateTodos?.content?.length > 0}
					{#each selectedDateTodos.content as todo (todo.id)}
						<div class="preset-filled-surface-100-800 rounded-lg p-4">
							<div class="flex items-center justify-between mb-2">
								<div class="flex items-center space-x-3">
									<form
										method="post"
										action="?/toggleComplete"
										use:enhance={() => {
											return async ({ update }) => {
												await update();
												invalidateAll();
											};
										}}
									>
										<input type="hidden" name="todoId" value={todo.id} />
										<button type="submit" class="btn p-0">
											{#if todo.status?.name === 'COMPLETED'}
												<Check class="w-5 h-5 text-success-500" />
											{:else}
												<Square class="w-5 h-5 text-surface-500" />
											{/if}
										</button>
									</form>
									<h3
										class="font-medium {todo.status?.name === 'COMPLETED'
											? 'line-through text-surface-500'
											: ''}"
									>
										{todo.title}
									</h3>
								</div>
								<button class="btn p-1">
									<EllipsisVertical class="w-4 h-4" />
								</button>
							</div>

							{#if todo.description}
								<p class="text-sm text-surface-600-300 mb-3">{todo.description}</p>
							{/if}

							<div class="flex items-center justify-between text-xs">
								<div class="flex items-center space-x-4">
									{#if todo.priority}
										<span class="preset-tonal-{todo.priority.colorCode} px-2 py-1 rounded text-xs">
											{todo.priority.name}
										</span>
									{/if}
									{#if todo.category}
										<span class="preset-outlined-surface px-2 py-1 rounded text-xs">
											{todo.category.name}
										</span>
									{/if}
								</div>

								{#if todo.dueTime}
									<div class="flex items-center space-x-1 text-surface-600-300">
										<Clock class="w-3 h-3" />
										<span>{formatDateTime(todo.dueTime)}</span>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				{:else}
					<div class="text-center py-12">
						<img src={noHaveTodo} alt="할 일 없음" class="mx-auto w-32 h-32 mb-4 opacity-50" />
						<p class="text-surface-600-300">선택한 날짜에 할 일이 없습니다</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</main>
