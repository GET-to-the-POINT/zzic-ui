<script>
	import { page } from '$app/state';
	import LogoSection from '$lib/header/LogoSection.svelte';
	import NavigationSection from '$lib/header/NavigationSection.svelte';
</script>

<header
	class="bg-primary flex justify-between items-center px-4"
>
	<LogoSection />
	<NavigationSection user={page.data?.user} />
</header>
