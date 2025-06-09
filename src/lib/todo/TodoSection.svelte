<script>
	import TodoItem from './TodoItem.svelte';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import Circle from '@lucide/svelte/icons/circle';

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
	 * @typedef {Object} Action
	 * @property {string} formAction - 폼 액션 경로 (예: "?/done", "?/undone")
	 * @property {string} buttonClass - 버튼 CSS 클래스
	 * @property {string} iconClass - 아이콘 CSS 클래스  
	 * @property {string} title - 버튼 툴팁
	 * @property {any} icon - 아이콘 컴포넌트
	 */

	/**
	 * @typedef {Object} Props
	 * @property {Todo[]} todos - 할 일 목록
	 * @property {string} title - 섹션 제목
	 * @property {number} [totalCount] - 총 투두 개수 (API에서 제공하는 totalElements)
	 * @property {string} [class] - 외부에서 주입받을 CSS 클래스
	 */

	/** @type {Props} */
	const { 
		todos = [], 
		title,
		totalCount,
		class: className
	} = $props();

	/**
	 * 투두 상태에 따른 액션 생성
	 * @param {Todo} todo - 투두 아이템
	 * @returns {Action} 액션 객체
	 */
	function createAction(todo) {
		if (todo.done) {
			return {
				formAction: "?/undone",
				buttonClass: "p-2 rounded-full hover:bg-white/20 transition-all duration-200 group",
				iconClass: "text-green-500 group-hover:text-gray-400 transition-colors duration-200",
				title: "완료 취소",
				icon: CheckCircle2
			};
		} else {
			return {
				formAction: "?/done", 
				buttonClass: "p-2 rounded-full hover:bg-white/20 transition-all duration-200 group",
				iconClass: "text-gray-400 group-hover:text-green-500 transition-colors duration-200",
				title: "완료 표시",
				icon: Circle
			};
		}
	}
</script>

<section class={[
  'space-y-6',
  className
]} aria-label={title + ' 목록'}>
  <!-- 섹션 헤더 -->
  <header class="flex items-center justify-between mb-2">
    <h2 class="text-2xl font-bold bg-gradient-to-r from-pink-400 via-pink-300 to-blue-300 bg-clip-text text-transparent tracking-tight drop-shadow select-none">
      {title}
    </h2>
	<span class="px-3 py-1 bg-white/30 dark:bg-black/30 rounded-full text-sm font-medium shadow-sm border border-white/20 dark:border-gray-700/20">
	  {totalCount}
	</span>
  </header>

  <!-- 투두 목록 -->
  <div class="space-y-3">
    {#if totalCount === 0}
      <div class="text-center py-8 text-base italic select-none opacity-70">
        ✨ 할 일이 없어요! 새로운 투두를 추가해보세요 ✨
      </div>
    {:else}
      {#each todos as todo (todo.id)}
        <TodoItem {todo} action={createAction(todo)} />
      {/each}
    {/if}
  </div>
</section>
