<script>
	const { class: className = '' } = $props();
</script>

<div
	class={['max-w-2xl', 'mx-auto', 'mb-16', 'flex', 'flex-col', 'items-center', 'gap-2', className]}
>
	<p
		class={[
			'font-bold',
			'text-4xl',
			'md:text-6xl',
			'bg-gradient-to-r',
			'from-pink-400',
			'to-purple-400',
			'dark:from-pink-300',
			'dark:to-purple-300',
			'bg-clip-text',
			'text-transparent',
			'leading-tight',
			'text-center',
			'drop-shadow-lg'
		]}
	>
		<span class="align-middle">🌸매일이 설레는 할 일🌸</span>
	</p>
	<p
		class={[
			'font-medium',
			'text-lg',
			'md:text-2xl',
			'bg-gradient-to-r',
			'from-fuchsia-400',
			'to-pink-400',
			'dark:from-fuchsia-300',
			'dark:to-pink-300',
			'bg-clip-text',
			'text-transparent',
			'leading-relaxed',
			'text-center',
			'mt-2'
		]}
	>
		<span class="block">투두리스트가 이렇게 귀여워도 돼?</span>
		<span class="block">오늘도 기분좋게 목표를 완성해요 ✨</span>
	</p>
</div>
