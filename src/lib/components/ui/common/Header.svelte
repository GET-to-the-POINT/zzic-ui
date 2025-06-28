<script>
	import { page } from '$app/state';
	import Bell from '@lucide/svelte/icons/bell';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import X from '@lucide/svelte/icons/x';

	const handleBack = (e) => {
		e.preventDefault();
		window.history.back();
	};

	const ContextMenu = $derived(page.data?.contextMenu);
</script>

<header class={[
	'p-4 h-12 flex items-center justify-between',
	!(page.url.pathname.includes('update') || page.url.pathname.includes('delete')) && 'preset-filled-primary-500',
	page.url.pathname.includes('update') && 'preset-filled-tertiary-500',
	page.url.pathname.includes('delete') && 'preset-filled-warning-500',
]}>
	<a href={page.data.returnTo} class="btn-icon w-6 h-6 cursor-pointer" onclick={handleBack}>
		{#if page.data.meta?.modal}
			<X class="w-6 h-6" />
		{:else}
		<ChevronLeft class="w-6 h-6" />
		{/if}
	</a>
	<h1 class="text-2xl font-semibold uppercase">{page.data.meta?.title ?? 'header'}</h1>
	{#if ContextMenu}
		<ContextMenu class="w-6 h-6" />
	{:else}
	<button class="btn-icon w-6 h-6">
		<Bell class="w-6 h-6" />
	</button>
	{/if}
</header>
