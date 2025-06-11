<script>
	/**
	 * @typedef {Object} Props
	 * @property {'primary'|'secondary'|'success'|'warning'|'danger'} [variant]
	 * @property {'sm'|'md'|'lg'} [size]
	 * @property {string[]|string} [class]
	 * @property {string} [as] // 'button' | 'a' | ...
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	const {
		variant = 'primary',
		size = 'md',
		class: className = [],
		children,
		as = 'button',
		...restProps
	} = $props();

	const variantClasses = {
		primary: 'from-pink-200 to-blue-200 hover:from-pink-300 hover:to-blue-300',
		secondary: 'from-violet-200 to-pink-100 hover:from-violet-300 hover:to-pink-200',
		success: 'from-green-200 to-teal-100 hover:from-green-300 hover:to-teal-200',
		warning: 'from-yellow-200 to-orange-100 hover:from-yellow-300 hover:to-orange-200',
		danger: 'from-red-200 to-pink-200 hover:from-red-300 hover:to-pink-300',
		ghost:
			'bg-transparent border border-pink-200 text-pink-400 hover:bg-pink-50 dark:border-pink-400 dark:text-pink-200 dark:hover:bg-pink-900'
	};

	const sizeClasses = {
		sm: 'px-4 py-2 text-sm',
		md: 'px-6 py-3 text-base',
		lg: 'px-8 py-4 text-lg'
	};

	const baseClasses =
		'group relative bg-gradient-to-r text-white font-bold rounded-full shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 justify-center overflow-hidden';

	const buttonClasses = [baseClasses, variantClasses[variant], sizeClasses[size], className];
</script>

<svelte:element this={as} {...restProps} class={buttonClasses}>
	{@render children?.()}
</svelte:element>
