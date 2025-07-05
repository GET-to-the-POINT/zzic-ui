<script>
	import Search from '@lucide/svelte/icons/search';
	import { page } from '$app/state';

	import TodoList from '$lib/components/widgets/todos/TodoListWidget.svelte';

	const { data } = $props();

	/** @type {HTMLFormElement} */
	let form;

	const handleInput = async (event) => {
		form.requestSubmit();
	};
</script>

<div class="card preset-filled-surface-50-950 p-4">
	<form
		class="space-y-4"
		data-sveltekit-keepfocus
		data-sveltekit-replacestate
		bind:this={form}
		oninput={handleInput}
	>
		<label class="label">
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell">
					<Search size="16" />
				</div>
				<input name="keyword" type="text" value={page.url.searchParams.get('keyword')} />
			</div>
		</label>
	</form>
</div>

<TodoList todoPage={data.todoPage} />
