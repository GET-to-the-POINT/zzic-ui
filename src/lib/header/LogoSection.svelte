<script>
	import { page } from '$app/state';

	const title = $derived(page.data?.title || 'ZZIC');
</script>

<a href="/" class="flex gap-2 py-4 px-2 text-primary-foreground">
	<h1 class="font-black text-2xl tracking-wider">
		{title}
	</h1>
</a>
