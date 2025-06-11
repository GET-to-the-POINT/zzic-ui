<script>
	import HeroActions from '$lib/landing/HeroActions.svelte';
	import HeroDescription from './HeroDescription.svelte';
</script>

<section class="min-h-screen px-4 text-center content-center">
	<div class="max-w-4xl mx-auto space-y-8">
		<h1 class="text-8xl md:text-9xl font-bold text-primary">
			ZZIC
		</h1>
		<HeroDescription />
		<HeroActions />
	</div>
</section>
