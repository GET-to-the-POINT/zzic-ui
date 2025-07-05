<script>
	const { children } = $props();
	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { initializeTheme } from '$lib/utils/theme.js';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
	
	onMount(() => {
		initializeTheme();
	});
	
	import { Toaster } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from '$lib/utils/toast';
</script>

<Toaster {toaster}></Toaster>
{@render children()}
