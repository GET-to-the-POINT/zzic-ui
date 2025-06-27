<script>
	import Bell from '@lucide/svelte/icons/bell';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';

	import { page } from '$app/state';

	const handleBack = (e) => {
		e.preventDefault();
		window.history.back();
	};
</script>

<header class="preset-filled-primary-500 p-4 h-12 flex items-center justify-between">
	<a href={page.data.returnTo} class="btn-icon w-6 h-6" onclick={handleBack}>
		<ChevronLeft class="w-6 h-6" />
	</a>
	<h1 class="text-2xl font-semibold uppercase">{page.data.meta?.title ?? 'header'}</h1>
	<button class="btn-icon w-6 h-6">
		<Bell class="w-6 h-6" />
	</button>
</header>
