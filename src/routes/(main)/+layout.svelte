<script>
	import BottomNavigation from '$lib/components/ui/common/BottomNavigation.svelte';
	import Header from '$lib/components/ui/common/Header.svelte';
	import Sidebar from '$lib/components/ui/common/Sidebar.svelte';
	const { children } = $props();
</script>

<!-- <Sidebar /> -->
<Header />
{@render children()}
<BottomNavigation />
