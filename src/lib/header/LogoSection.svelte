<script>
	import { page } from '$app/state';
	import { celebrate } from '$lib/utils/confetti.js';

	const title = $derived(page.data?.title || 'ZZIC');

	function handleLogoClick() {
		if (page.url.pathname === '/') {
			celebrate();
		}
	}
</script>

<a href="/" class="flex gap-2 py-4 px-2 text-primary-foreground" onclick={handleLogoClick}>
	<h1 class="font-black text-2xl tracking-wider">
		{title}
	</h1>
</a>
