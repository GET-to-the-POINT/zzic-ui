<script>
	import { onNavigate } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	const { children } = $props();
</script>

<Header/>
{@render children()}