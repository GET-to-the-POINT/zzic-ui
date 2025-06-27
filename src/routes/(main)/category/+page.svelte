<script>
	import { page } from '$app/state';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	const { data } = $props();
</script>

{#snippet categoryItem(item)}
	<div class="h-12 preset-filled-surface-500 flex justify-center">
		<form class="flex-1 content-center" action={page.data.returnTo}>
			<button class="w-full text-left px-4">{item.name}</button>
		</form>
		<button class="aspect-square btn preset-filled-warning-500">
			<Trash2 size="32" />
		</button>
	</div>
{/snippet}

<div class="p-4 space-y-4">
	{#each data.categories.content as item}
		{@render categoryItem(item)}
	{/each}
</div>
