<script>
	import { page } from '$app/state';
</script>

<div class="p-4 bg-surface-500">
	<div class="grid grid-cols-7 gap-2">
		{#each page.data.weeklyTodos as dateItem}
		<form action='/todos'>
			<input type="hidden" name="startDate" value={dateItem.startDate} />
			<input type="hidden" name="endDate" value={dateItem.endDate} />
			<input type="hidden" name="hideStatusIds" value={page.url.searchParams.get('hideStatusIds')} />
			<button
				type="submit"
				class={[
				'btn relative h-16 w-16 flex-col',
				dateItem.isToday ? 'preset-filled-primary-500' : 'preset-filled-surface-50-950',
				dateItem.empty ? '' : "before:content-[''] before:absolute before:top-1 before:right-1 before:w-2 before:h-2 before:bg-secondary-500 before:rounded-full",
			]}
			>
				<span class="text-xs font-semibold">
					{dateItem.dayName}
				</span>
				<span class="text-xs font-semibold">
					{dateItem.day}
				</span>
			</button>
		</form>
		{/each}
	</div>
</div>