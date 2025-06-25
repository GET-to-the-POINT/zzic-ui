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
					'btn relative w-full',
					dateItem.selected ? 'preset-filled-primary-500' : 'preset-filled-surface-50-950',
					!dateItem.empty &&
						'after:content-[""] after:absolute after:inset-x-0 after:bottom-0 after:h-2 after:bg-secondary-500'
				]}
				>
					<div class="flex flex-col items-center justify-center gap-1 p-2">
						<div class="text-xs font-semibold">
							{dateItem.day}
						</div>
						<div class="text-xs font-semibold">
							{dateItem.dayNumber}
						</div>
					</div>
				</button>
			</form>
			{/each}
		</div>
	</div>