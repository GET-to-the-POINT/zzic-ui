<script></script>
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	const {
		currentMonth,
		weekDays = ['일', '월', '화', '수', '목', '금', '토'],
		monthlyTodos = [],
		navigation,
		onPrevMonth = () => {},
		onNextMonth = () => {},
		showNavigation = true,
		compact = false
	} = $props();

	function handlePrevMonth() {
		onPrevMonth?.();
	}

	function handleNextMonth() {
		onNextMonth?.();
	}
</script>

<div class={compact ? 'text-sm' : ''}>
	{#if showNavigation}
		<!-- Date Picker Container -->
		<div class="flex items-center justify-between px-4 h-12 preset-filled-surface-50-950">
			<button
				type="button"
				onclick={handlePrevMonth}
				class="grid items-center-safe w-6 h-6 hover:preset-filled-surface-400 rounded"
			>
				<ChevronLeft class={compact ? 'w-4 h-4' : 'w-6 h-6'} />
			</button>
			<h2 class={compact ? 'font-medium text-sm' : 'font-semibold'}>{currentMonth}</h2>
			<button
				type="button"
				onclick={handleNextMonth}
				class="grid items-center-safe w-6 h-6 hover:preset-filled-surface-400 rounded"
			>
				<ChevronRight class={compact ? 'w-4 h-4' : 'w-6 h-6'} />
			</button>
		</div>
	{:else}
		<!-- 네비게이션 없는 경우 제목만 표시 -->
		<div class="text-center py-2">
			<h2 class={compact ? 'font-medium text-sm' : 'font-semibold'}>{currentMonth}</h2>
		</div>
	{/if}

	<!-- Week Days Header -->
	<div class={`grid grid-cols-7 font-semibold text-center preset-filled-primary-500 ${compact ? 'h-6 text-xs' : 'h-8'}`}>
		{#each weekDays as day}
			<div>
				{day}
			</div>
		{/each}
	</div>

	<!-- Calendar Grid -->
	<div class={`grid grid-cols-7 grid-rows-5 ${compact ? 'gap-px' : ''}`}>
		{#each monthlyTodos as day}
			{@const searchParams = new URLSearchParams({startDate: day.date, endDate: day.date})}
			<a 
				href={`/todos/?${searchParams.toString()}`}
				class={[
					compact ? 'btn h-8 text-xs' : 'btn h-16',
					'relative border-b-1 border-primary-500',
					day.isToday ? 'preset-filled-primary-500' : 'preset-filled-surface-50-950',
					day.isCurrentMonth ? '' : 'opacity-75',
					day.empty
						? ''
						: compact 
							? "before:content-[''] before:absolute before:top-0.5 before:right-0.5 before:w-1 before:h-1 before:bg-secondary-500 before:rounded-full"
							: "before:content-[''] before:absolute before:top-1 before:right-1 before:w-2 before:h-2 before:bg-secondary-500 before:rounded-full"
				]}
			>
				{day.day}
			</a>
		{/each}
	</div>
</div>
