<script>
	import Sidebar from '$lib/components/ui/common/Sidebar.svelte';
	const { children } = $props();
</script>

<Sidebar />
{@render children()}
