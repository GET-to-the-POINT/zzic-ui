<script>
	import TodoForm from '$lib/components/widgets/todos/TodoForm.svelte';

	const { data } = $props();
</script>

<TodoForm
	mode="detail"
	todo={data.todo}
	categories={data.categories?.content ?? []}
	priorities={data.priorities?.content ?? []}
	repeatTypes={data.repeatTypes.content}
	formId={data.formId}
/>
