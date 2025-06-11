<script>
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import TodoSection from '$lib/todo/TodoSection.svelte';
	import TodoStats from '$lib/todo/TodoStats.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import TodoCreateForm from '../members/[nickname]/TodoCreateForm.svelte';

	/**
	 * @typedef {Object} Todo
	 * @property {string} id - Todo ID
	 * @property {string} title - Todo 제목
	 * @property {string} [description] - Todo 설명
	 * @property {boolean} done - 완료 여부
	 * @property {string} createdAt - 생성 시간
	 * @property {string} [updatedAt] - 수정 시간
	 */

	/**
	 * @typedef {Object} TodoPage
	 * @property {Array<Todo>} content - Todo 목록
	 * @property {number} totalElements - 전체 요소 개수
	 * @property {number} totalPages - 전체 페이지 수
	 * @property {number} number - 현재 페이지 번호
	 * @property {number} size - 페이지 크기
	 */

	/**
	 * @typedef {Object} PageData
	 * @property {Array<Todo>} yetTodos - 미완료 todo 목록
	 * @property {Array<Todo>} doneTodos - 완료된 todo 목록
	 * @property {TodoPage} yetTodoPage - 미완료 todo 페이지 정보
	 * @property {TodoPage} doneTodoPage - 완료된 todo 페이지 정보
	 */

	/** @type {{ data: PageData }} */
	const { data } = $props();

	let todoCreateDialog = $state(false);

	const closeTodoCreateDialog = () => {
		todoCreateDialog = false;
	};

	// Svelte 5에서 데이터 추출 (page.js에서 이미 배열로 추출됨)
	let yetTodos = $derived(data?.yetTodos);
	let doneTodos = $derived(data?.doneTodos);
	let yetTotalElements = $derived(data?.yetTodoPage.totalElements);
	let doneTotalElements = $derived(data?.doneTodoPage.totalElements);
</script>

<main class="space-y-6 p-4">
	<TodoStats
		doneTotalElements={doneTotalElements}
		yetTotalElements={yetTotalElements}
	/>

	<Dialog.Root bind:open={todoCreateDialog}>
		<Dialog.Trigger class="w-full">
			<Button variant="ghost" class="cursor-pointer w-full">
				TODO 추가
			</Button>
		</Dialog.Trigger>

		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>새로운 Todo 추가</Dialog.Title>
				<Dialog.Description>
					새로운 Todo를 추가해보세요!
				</Dialog.Description>
			</Dialog.Header>

			<TodoCreateForm
				onSuccess={closeTodoCreateDialog}
				>
				<Dialog.Footer>
					<Form.Button>추가하기</Form.Button>
				</Dialog.Footer>
			</TodoCreateForm>
		</Dialog.Content>
	</Dialog.Root>

	<TodoSection
		title="이루어갈 꿈들"
		todos={yetTodos}
		totalCount={yetTotalElements}
	/>

	<TodoSection
		title="이루어낸 꿈들"
		todos={doneTodos}
		totalCount={doneTotalElements}
	/>
</main>
