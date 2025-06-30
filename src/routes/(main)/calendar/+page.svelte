<script>
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	const { data } = $props();
</script>

<!-- Date Picker Container -->
<div class="flex items-center justify-between px-4 h-12 preset-filled-surface-500">
	<form>
		<button
			type="submit"
			name="date"
			value={data.navigation.prevMonth}
			class="grid items-center-safe w-6 h-6"
		>
			<ChevronLeft class="w-6 h-6" />
		</button>
	</form>
	<h2 class="font-semibold">{data.currentMonth}</h2>
	<form>
		<button
			type="submit"
			name="date"
			value={data.navigation.nextMonth}
			class="grid items-center-safe w-6 h-6"
		>
			<ChevronRight class="w-6 h-6" />
		</button>
	</form>
</div>

<!-- Week Days Header -->
<div class="grid grid-cols-7 h-8 font-semibold text-center preset-filled-primary-500">
	{#each data.weekDays as day}
		<div>
			{day}
		</div>
	{/each}
</div>

<!-- Calendar Grid -->
<div class="grid grid-cols-7 grid-rows-5">
	{#each data.monthlyTodos as day}
		{@const searchParams = new URLSearchParams({startDate: day.date, endDate: day.date})}
		<a 
			href={`/todos/?${searchParams.toString()}`}
			class={[
				`btn h-16`,
				'relative border-b-1 border-primary-500',
				day.isToday ? 'preset-filled-primary-500' : 'preset-filled-surface-50-950',
				day.isCurrentMonth ? '' : 'opacity-75',
				day.empty
					? ''
					: "before:content-[''] before:absolute before:top-1 before:right-1 before:w-2 before:h-2 before:bg-secondary-500 before:rounded-full"
			]}
		>
			{day.day}
		</a>
		<!-- <form
			action={`/todos`}
			class={[
				'relative text-center border-b-2 border-primary-500 hover:preset-filled-surface-500',
				day.isToday ? 'preset-filled-primary-500' : 'preset-filled-surface-50-950',
				day.isCurrentMonth ? '' : 'opacity-75'
			]}
		>
			<input type="hidden" name="startDate" value={day.date} />
			<input type="hidden" name="endDate" value={day.date} />
			<button
				type="submit"
				class={[
					`btn w-full h-16`,
					day.empty
						? ''
						: "before:content-[''] before:absolute before:top-1 before:right-1 before:w-2 before:h-2 before:bg-secondary-500 before:rounded-full"
				]}
			>
				{day.day}
			</button>
		</form> -->
	{/each}
</div>
