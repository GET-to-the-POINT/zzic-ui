<script>
	import { enhance } from '$app/forms';

	/**
	 * @typedef {Object} TodoDetailProps
	 * @property {{ title: string, description: string }} [todo]
	 * @property {string} action
	 * @property {string} buttonText
	 * @property {string | string[]} [class]
	 */
	/** @type {TodoDetailProps} */
	let { todo = { title: '', description: '' }, action, buttonText, class: className } = $props();
</script>

<form method="POST" use:enhance {action} class={['space-y-4', className]}>
	<label
		class={[
			'block',
			'font-bold text-lg md:text-xl',
			'bg-gradient-to-r from-pink-400 via-pink-300 to-blue-300',
			'bg-clip-text text-transparent',
			'tracking-tight',
			'drop-shadow',
			'select-none',
			'transition-colors duration-300',
			'space-y-1'
		]}
	>
		<span class="block">제목</span>
		<input
			name="title"
			type="text"
			value={todo.title}
			required
			class={[
				'w-full px-4 py-2 rounded-xl',
				'bg-white/60 dark:bg-black/30',
				'border border-gray-300 dark:border-gray-600',
				'focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-400',
				'transition-all duration-200',
				'text-lg'
			]}
		/>
	</label>

	<label
		class={[
			'block',
			'font-bold text-lg md:text-xl',
			'bg-gradient-to-r from-blue-400 via-pink-300 to-pink-200',
			'bg-clip-text text-transparent',
			'tracking-tight',
			'drop-shadow',
			'select-none',
			'transition-colors duration-300',
			'space-y-1'
		]}
	>
		<span class="block">설명</span>
		<textarea
			name="description"
			class={[
				'w-full px-4 py-2 rounded-xl',
				'bg-white/60 dark:bg-black/30',
				'border border-gray-300 dark:border-gray-600',
				'focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400',
				'transition-all duration-200',
				'text-base',
				'resize-none'
			]}>{todo.description}</textarea
		>
	</label>

	<button
		type="submit"
		class={[
			'w-full',
			'py-2 px-4 rounded-xl',
			'bg-gradient-to-r from-pink-300 via-pink-200 to-blue-200',
			'text-pink-500',
			'font-bold text-lg',
			'shadow-md',
			'hover:scale-105 hover:-translate-y-0.5',
			'active:scale-98',
			'transition-all duration-200'
		]}
	>
		{buttonText}
	</button>
</form>
