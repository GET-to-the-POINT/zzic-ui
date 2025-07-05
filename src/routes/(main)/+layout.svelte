<script>
	import { page } from '$app/state';
	import BottomNavigation from '$lib/components/widgets/navigation/BottomNavigation.svelte';
	import Header from '$lib/components/widgets/navigation/Header.svelte';
	import Sidebar from '$lib/components/widgets/navigation/Sidebar.svelte';
	const { children } = $props();
	
	// 모달 여부 확인
	const isModal = $derived(page.data?.meta?.modal === true);
</script>

<!-- <Sidebar /> -->
<Header />
{@render children()}
{#if !isModal}
	<BottomNavigation />
{/if}
