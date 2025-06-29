<script>
	const { children } = $props();
	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
  import { Toaster } from '@skeletonlabs/skeleton-svelte';
  import { toaster } from '$lib/utils/toast';
  </script>
  
<Toaster {toaster}></Toaster>
{@render children()}
