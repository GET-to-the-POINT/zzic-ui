<script>
	import TodoForm from '$lib/components/widgets/todos/TodoForm.svelte';
	import { goto } from '$app/navigation';

	const { data } = $props();

	const handleSuccess = () => {
		goto('/todos', { invalidateAll: true });
	};
</script>

<TodoForm
	mode="create"
	categories={data.categories.content}
	priorities={data.priorities?.content ?? []}
	repeatTypes={data.repeatTypes.content}
	formId={data.formId}
	onSuccess={handleSuccess}
	successMessage="할 일이 성공적으로 생성되었습니다!"
/>
