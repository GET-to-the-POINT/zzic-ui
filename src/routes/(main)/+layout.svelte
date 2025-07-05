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
<div class="flex flex-col min-h-screen">
	<Header />

	<main class="p-4 space-y-4 flex-1 flex flex-col">
		{@render children()}
	</main>

	{#if !isModal}
		<BottomNavigation />
	{/if}
</div>
