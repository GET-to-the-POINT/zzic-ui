<script>
	/**
	 * @typedef {Object} Props
	 * @property {'sm'|'md'|'lg'} size - 버튼 크기
	 * @property {string} [as] - 렌더링할 태그명 (기본값: 'button', 'a' 등)
	 * @property {string} [class] - 추가 CSS 클래스
	 * @property {any} [children] - 버튼 내부에 렌더링할 자식
	 */

	/** @type {Props} */
	const {
		size,
		as = 'button',
		class: className,
		children,
		...restProps
	} = $props();


</script>

<svelte:element 
	this={as}
	class={[
		'group bg-white/30 backdrop-blur-md border border-white/30 dark:bg-zinc-900/30 dark:border-zinc-200/20 shadow-lg rounded-full font-semibold flex items-center gap-3 justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 dark:focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-98 active:translate-y-0 cursor-pointer text-zinc-900 dark:text-white select-none',
		{
			'px-4 py-2 text-sm min-w-[120px]': size === 'sm',
			'px-6 py-3 text-base min-w-[150px]': size === 'md',
			'px-8 py-4 text-lg min-w-[200px]': size === 'lg',
		},
			'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:-translate-y-0 disabled:active:scale-100',
		className
	]} 
	{...restProps}
>
	{@render children?.()}
</svelte:element>
