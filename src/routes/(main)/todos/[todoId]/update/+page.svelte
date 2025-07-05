<script>
	import TodoForm from '$lib/components/widgets/todos/TodoForm.svelte';
	import { invalidateAll } from '$app/navigation';

	const { data } = $props();

	const handleSuccess = () => {
		invalidateAll();
	};
</script>

<TodoForm
	mode="update"
	todo={data.todo}
	categories={data.categories?.content ?? []}
	priorities={data.priorities?.content ?? []}
	repeatTypes={data.repeatTypes.content}
	formId={data.formId}
	onSuccess={handleSuccess}
	successMessage="할 일이 성공적으로 업데이트되었습니다!"
/>
