<script>
	import { goto } from '$app/navigation';
	import Calendar from '@lucide/svelte/icons/calendar';

	let { note } = $props();

	function selectNote() {
		goto(`/notes/${note.id}`);
	}
</script>

<div
	class="card preset-filled-surface-50-950 p-6 cursor-pointer hover:scale-[1.02] transition-transform"
	onclick={selectNote}
	role="button"
	tabindex="0"
	onkeypress={(e) => e.key === 'Enter' && selectNote()}
>
	<div class="flex items-center justify-between">
		<h3 class="text-lg font-semibold truncate flex-1 mr-4">
			{note.title}
		</h3>
		<div class="flex items-center gap-2 text-sm text-surface-600">
			<Calendar size={14} />
			<time>
				{new Date(note.updatedAt).toLocaleDateString('ko-KR', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}
			</time>
		</div>
	</div>
</div>
