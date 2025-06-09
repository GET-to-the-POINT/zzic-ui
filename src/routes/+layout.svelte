<script>
	import FloatingHeart from '$lib/ui/FloatingHeart.svelte';
	const { children } = $props();
</script>

{@render children()}
<FloatingHeart />