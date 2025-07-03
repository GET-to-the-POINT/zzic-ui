<script>
	import BottomNavigation from '$lib/components/widgets/navigation/BottomNavigation.svelte';
	import Header from '$lib/components/widgets/navigation/Header.svelte';
	import Sidebar from '$lib/components/widgets/navigation/Sidebar.svelte';
	const { children } = $props();
</script>

<!-- <Sidebar /> -->
<Header />
{@render children()}
<BottomNavigation />
