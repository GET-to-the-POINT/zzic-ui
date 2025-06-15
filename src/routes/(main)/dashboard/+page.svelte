<script>
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import TodoSection from '$lib/todo/TodoSection.svelte';
	import TodoStats from '$lib/todo/TodoStats.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import TodoCreateForm from '$lib/components/sections/todo/TodoCreateForm.svelte';
	import ChallengeList from '$lib/components/sections/challenge/ChallengeList.svelte';

	/**
	 * @typedef {import('$lib/zzic-api/todo.js').TodoDto} TodoDto
	 * @typedef {import('$lib/zzic-api/todo.js').PageTodoDto} PageTodoDto
	 * @typedef {import('$lib/zzic-api/challenge.js').ChallengeDto} ChallengeDto
	 */

	const { data } = $props();

	let todoCreateDialog = $state(false);

	const closeTodoCreateDialog = () => {
		todoCreateDialog = false;
	};
</script>

<main class="space-y-6 p-4">
	<TodoStats
		doneTotalElements={data?.doneTodoPage.totalElements}
		yetTotalElements={data?.yetTodoPage.totalElements}
	/>

	<ChallengeList
		challenges={data?.challengePage.content}
	/>

	<Dialog.Root bind:open={todoCreateDialog}>
		<Dialog.Trigger class="w-full">
			<Button variant="ghost" class="cursor-pointer w-full" disabled={false}>
				Todo 추가
			</Button>
		</Dialog.Trigger>

		<Dialog.Content class="" portalProps={{}}>
			<Dialog.Header class="">
				<Dialog.Title class="">새로운 Todo 추가</Dialog.Title>
				<Dialog.Description class="">
					새로운 Todo를 추가해보세요!
				</Dialog.Description>
			</Dialog.Header>

			<TodoCreateForm
				onSuccess={closeTodoCreateDialog}
				>
				<Dialog.Footer class="">
					<Form.Button>추가하기</Form.Button>
				</Dialog.Footer>
			</TodoCreateForm>
		</Dialog.Content>
	</Dialog.Root>

	<TodoSection
		title="이루어갈 꿈들"
		todos={data?.yetTodoPage.content}
		totalCount={data?.yetTodoPage.totalElements}
	/>

	<TodoSection
		title="이루어낸 꿈들"
		todos={data?.doneTodoPage.content}
		totalCount={data?.doneTodoPage.totalElements}
	/>
</main>
