<script>
	const { children } = $props();
	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { initializeTheme } from '$lib/utils/theme.js';

	onMount(() => {
		initializeTheme();
	});

	import { Toaster } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from '$lib/utils/toast';
</script>

<Toaster {toaster}></Toaster>
{@render children()}
