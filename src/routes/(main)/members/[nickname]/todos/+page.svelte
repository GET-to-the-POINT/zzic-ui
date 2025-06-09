<script>
	import TodoDetail from '$lib/components/sections/todo/TodoDetail.svelte';
	import TodoSection from '$lib/todo/TodoSection.svelte';
	import TodoStats from '$lib/todo/TodoStats.svelte';

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
	
	// Svelte 5에서 데이터 추출 (page.js에서 이미 배열로 추출됨)
	let yetTodos = $derived(data?.yetTodos || []);
	let doneTodos = $derived(data?.doneTodos || []);
	let yetTodoPage = $derived(data?.yetTodoPage);
	let doneTodoPage = $derived(data?.doneTodoPage);
</script>

<main class={[
  'container mx-auto',
  'px-4 py-8',
  'space-y-6'
]}>
	<TodoStats 
		{yetTodos} 
		{doneTodos} 
		fadeDelay={200}
				class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl"

	/>

	<TodoDetail 
		class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl"
		action="?/create" 
		buttonText="추가하기"
	/>

	<TodoSection 
		todos={yetTodos}
		totalCount={yetTodoPage?.totalElements}
		title="이루어갈 꿈들"
				class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl"

	/>

	<TodoSection 
		todos={doneTodos}
		totalCount={doneTodoPage?.totalElements}
		title="이루어낸 꿈들"
				class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl"

	/>
</main>
