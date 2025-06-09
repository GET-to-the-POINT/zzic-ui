<script>
	import Calendar from '@lucide/svelte/icons/calendar';
	import Clock from '@lucide/svelte/icons/clock';
	import Star from '@lucide/svelte/icons/star';

	/**
	 * @typedef {Object} Todo
	 * @property {string} id - Todo ID
	 * @property {string} title - Todo 제목
	 * @property {boolean} done - 완료 여부
	 */

	/**
	 * @typedef {Object} Props
	 * @property {Todo[]} yetTodos - 미완료 todo 목록
	 * @property {Todo[]} doneTodos - 완료된 todo 목록
	 * @property {number} [fadeDelay=1000] - fade 애니메이션 지연 시간
	 * @property {string} [class] - 외부에서 주입받을 CSS 클래스
	 */

	/** @type {Props} */
	const { yetTodos = [], doneTodos = [], fadeDelay = 1000, class: className } = $props();

	// 통계 계산
	let totalTodos = $derived(yetTodos.length + doneTodos.length);
	let progressTodos = $derived(yetTodos.length);
	let completedTodos = $derived(doneTodos.length);
</script>

<section
	class={[
	  'bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl',
	  'grid grid-cols-3 gap-4',
	  className
	]}
	aria-label="투두 통계"
>
	<dl class="space-y-1 text-center">
		<dt class="space-y-1">
			<Calendar class="text-primary w-full" size={36} />
			<span class="text-xs font-medium text-primary mt-1">전체</span>
		</dt>
		<dd class="text-2xl font-bold text-primary">{totalTodos}</dd>
	</dl>
	<dl class="space-y-1 text-center">
		<dt class="space-y-1">
			<Clock class="text-accent w-full" size={36} />
			<span class="text-xs font-medium text-accent mt-1">진행</span>
		</dt>
		<dd class="text-2xl font-bold text-accent">{progressTodos}</dd>
	</dl>
	<dl class="space-y-1 text-center">
		<dt class="space-y-1">
			<Star class="text-warning w-full" size={36} />
			<span class="text-xs font-medium text-warning mt-1">완성</span>
		</dt>
		<dd class="text-2xl font-bold text-warning">{completedTodos}</dd>
	</dl>
</section>