<script>
	import { enhance } from '$app/forms';
	import Sparkles from '@lucide/svelte/icons/sparkles';

	/**
	 * @typedef {Object} Props
	 * @property {string} actionUrl - 폼 액션 URL (예: "/members/[nickname]/todos?/create")
	 * @property {Function} [onSuccess] - 성공 시 콜백 함수
	 * @property {Function} [onError] - 에러 시 콜백 함수
	 * @property {string} [class] - 외부에서 주입받을 CSS 클래스
	 */

	/** @type {Props} */
	const { actionUrl = '', onSuccess, onError, class: className = '' } = $props();

	/**
	 * 폼 제출 핸들러
	 */
	function handleSubmit() {
		console.log('CreateTodo: Form submission started...');

		return (/** @type {any} */ { result, update }) => {
			console.log('CreateTodo: Form submission result:', result);

			if (result.type === 'success' || result.type === 'redirect') {
				console.log('CreateTodo: Todo created successfully!');
				onSuccess?.(result);
				update();
			} else if (result.type === 'failure') {
				console.error('CreateTodo: Form submission failed:', result.data);
				onError?.(result.data);
			}
		};
	}
</script>

<form 
	use:enhance={handleSubmit}
	method="POST" 
	action={actionUrl}
	class={['space-y-4 backdrop-blur-sm bg-white/30 rounded-3xl p-6 border border-white/40 shadow-2xl', className]}
>
	<input
		type="text"
		name="title"
		placeholder="새로운 꿈 추가하기 ✨"
		required
		class="w-full px-4 py-3 bg-white/50 border-2 border-primary-light rounded-2xl text-text placeholder-text-muted focus:outline-none focus:border-primary focus:bg-white/70 transition-all duration-300"
	/>
	<textarea
		name="description"
		placeholder="꿈에 대한 자세한 이야기를 들려주세요 💭"
		class="w-full px-4 py-3 bg-white/50 border-2 border-accent-light rounded-2xl text-text placeholder-text-muted focus:outline-none focus:border-accent focus:bg-white/70 transition-all duration-300 resize-none"
		rows="3"
	></textarea>
	<button
		type="submit"
		class="ml-auto group px-6 py-2 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
	>
		<Sparkles class="group-hover:animate-spin" size={16} />
		꿈 추가하기
	</button>
</form>
