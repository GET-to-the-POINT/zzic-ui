<script>
	import { page } from '$app/state';
	import IconSearch from '@lucide/svelte/icons/search';
	import TodoList from '$lib/components/ui/todo/TodoList.svelte';

	const { data } = $props();

	/** @type {HTMLFormElement} */
	let form;

	const handleInput = async (event) => {
		form.requestSubmit();
	};
</script>

<section class="p-4 preset-filled-surface-500">
	<form class="space-y-4" data-sveltekit-keepfocus data-sveltekit-replacestate bind:this={form} oninput={handleInput}>
		<label class="label">
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell">
					<IconSearch size="16" />
				</div>
				<input
					name="keyword"
					type="text"
					value={page.url.searchParams.get('keyword')}
				/>
			</div>
		</label>
	</form>
</section>

<main class="p-4">
	<TodoList todoPage={data.todoPage} />
</main>