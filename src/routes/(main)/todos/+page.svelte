<script>
	import { page } from '$app/state';
	import TodoList from '$lib/components/widgets/todos/TodoListWidget.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
</script>

<main class="p-4 space-y-4">
	<div class="card p-4 flex justify-between preset-filled-secondary-50-950">
		<a
			href={`${page.url.pathname}?startDate=${page.data.weeklyTodos[0]?.startDate}&endDate=${page.data.weeklyTodos[0]?.endDate}&complete=${page.url.searchParams.get('complete')}`}
		>
			<ChevronLeft />
		</a>

		<div class="flex space-x-4 items-center-safe">
			{#each page.data.weeklyTodos as dateItem}
				<a
					href={`${page.url.pathname}?startDate=${dateItem.startDate}&endDate=${dateItem.endDate}&complete=${page.url.searchParams.get('complete')}`}
					class={[
						'btn relative',
						dateItem.selected ? 'preset-filled-primary-500' : 'preset-filled-tertiary-50-950',
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

		<a
			href={`${page.url.pathname}?startDate=${page.data.weeklyTodos.at(-1)?.startDate}&endDate=${page.data.weeklyTodos.at(-1)?.endDate}&complete=${page.url.searchParams.get('complete')}`}
		>
			<ChevronRight class="w-6 h-6" />
		</a>
	</div>

	<TodoList todoPage={page.data.selectedDateTodos} />
</main>
