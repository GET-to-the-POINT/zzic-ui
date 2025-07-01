<script>
	import { page } from '$app/state';
	import TodoList from '$lib/components/ui/todo/TodoList.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
</script>

<div
	class="flex justify-between items-center-safe h-24 font-semibold text-center preset-filled-surface-500"
>
	<a href={`${page.url.pathname}?startDate=${page.data.weeklyTodos[0]?.startDate}&endDate=${page.data.weeklyTodos[0]?.endDate}&hideStatusIds=${page.url.searchParams.get('hideStatusIds')}`}>
		<ChevronLeft class="w-6 h-6" />
	</a>

	<div class="flex space-x-4 items-center-safe">
		{#each page.data.weeklyTodos as dateItem}
			<a
				href={`${page.url.pathname}?startDate=${dateItem.startDate}&endDate=${dateItem.endDate}&hideStatusIds=${page.url.searchParams.get('hideStatusIds')}`}
				class={[
					'btn relative h-16 w-16 flex flex-col items-center justify-center',
					dateItem.selected ? 'preset-filled-primary-500' : 'preset-filled-surface-50-950',
					dateItem.empty
						? ''
						: "before:content-[''] before:absolute before:top-1 before:right-1 before:w-2 before:h-2 before:bg-secondary-500 before:rounded-full"
				]}
			>
				<span class="text-xs font-semibold">
					{dateItem.dayName}
				</span>
				<span class="text-xs font-semibold">
					{dateItem.day}
				</span>
			</a>
		{/each}
	</div>

	<a href={`${page.url.pathname}?startDate=${page.data.weeklyTodos.at(-1)?.startDate}&endDate=${page.data.weeklyTodos.at(-1)?.endDate}&hideStatusIds=${page.url.searchParams.get('hideStatusIds')}`}>
		<ChevronRight class="w-6 h-6" />
	</a>
</div>

<main class="p-4">
	<TodoList todoPage={page.data.selectedDateTodos} />
</main>
