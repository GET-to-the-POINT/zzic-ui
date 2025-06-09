<script>
	import { enhance } from '$app/forms';

	/**
	 * @typedef {Object} Todo
	 * @property {string|number} id
	 * @property {string} title
	 * @property {string} [description]
	 * @property {boolean} done
	 * @property {string} [userId] - 사용자 ID (없으면 'me'로 처리)
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
	 * @property {Todo} todo - 할 일 아이템
	 * @property {Action} action - 액션 버튼
	 */

	/** @type {Props} */
	const { todo, action } = $props();

	let formElement;
</script>

<div
	class={[
		"flex items-center rounded-2xl border border-white/20 dark:border-gray-700/20 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl",
		"group",
		"h-20",
		{ 'opacity-60': todo.done, 'hover:opacity-80': todo.done }
	]}
	aria-label={todo.title}
>
	<form
		method="POST"
		action={action.formAction}
		use:enhance
		bind:this={formElement}
		class="flex-shrink-0 h-full content-center p-4"
	>
		<input type="hidden" name="id" value={todo.id} />
		<button
			type="submit"
			title={action.title}
			class={["rounded-full p-2 bg-white/60 dark:bg-black/30 border border-white/30 dark:border-gray-700/30 shadow-md transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-400", action.buttonClass]}
		>
			<action.icon class={["w-6 h-6", action.iconClass]} aria-hidden="true" />
		</button>
	</form>

	<a
		href={`/members/${todo.userId || "me"}/todos/${todo.id}`}
		class="block w-full h-full content-center p-4"
	>
		<dl>
			<dt
				class="block text-lg md:text-xl font-bold bg-gradient-to-r from-pink-400 via-pink-300 to-blue-300 bg-clip-text text-transparent tracking-tight drop-shadow select-none transition-colors duration-300 truncate"
			>
				{todo.title}
			</dt>
			<dd
				class="block text-sm md:text-base text-gray-700 dark:text-gray-300 mt-1 truncate transition-colors duration-200"
			>
				{todo.description}
			</dd>
		</dl>
	</a>
</div>
