<script>
	import { page } from '$app/state';
	import * as Button from '$lib/components/ui/button/index.js';
	import LogoSection from '$lib/header/LogoSection.svelte';
	import NavigationSection from '$lib/header/NavigationSection.svelte';

	function handleBackClick() {
		history.back();
	}
</script>

<header
	class="bg-primary flex justify-between items-center px-4"
>
	<div class="flex items-center gap-2">
		<Button.Root
			variant="ghost"
			onclick={handleBackClick}
			aria-label="뒤로가기"
		>
			<svg 
				width="20" 
				height="20" 
				viewBox="0 0 24 24" 
				fill="none" 
				stroke="currentColor" 
				stroke-width="2" 
				stroke-linecap="round" 
				stroke-linejoin="round"
				class="text-white"
			>
				<path d="m15 18-6-6 6-6"/>
			</svg>
		</Button.Root>
		<LogoSection />
	</div>
	<NavigationSection user={page.data?.user} />
</header>
