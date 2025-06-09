<script>
	import HeroDescription from '$lib/landing/HeroDescription.svelte';
	import HeroActions from '$lib/landing/HeroActions.svelte';
</script>

<div class='space-y-4 relative'>
	<h1
	 class={[
		'my-20',
		'text-center',
		'font-bold',
		'hero-text',
		'text-8xl', 'md:text-9xl',
		'bg-clip-text', 'text-transparent',
		'bg-gradient-to-r', 'from-pink-400', 'to-purple-400',
		'dark:from-pink-300', 'dark:to-purple-300',
		'cursor-default', 'select-none',
		'leading-tight',
		'hover:scale-110', 'transition-transform', 'duration-300',
		'relative', 'z-20',
	]}>ZZIC</h1>
	<HeroDescription />
	<HeroActions />
</div>