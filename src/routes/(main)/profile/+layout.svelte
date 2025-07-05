<script>
	import { page } from '$app/state';
	import User from '@lucide/svelte/icons/user';
	import Users from '@lucide/svelte/icons/users';

	const { children } = $props();

	// Tab navigation based on route
	const tabs = [
		{ path: '/profile', label: '내 정보', icon: User },
		{ path: '/profile/friends', label: '친구', icon: Users }
	];
</script>

<!-- Action, Tab Navigation -->
<section class="card preset-filled-secondary-200-800 p-4 flex gap-2">
	{#each tabs as tab}
		{@const Icon = tab.icon}
		<a
			href={tab.path}
			class="btn {page.url.pathname === tab.path
				? 'preset-filled-primary-500'
				: 'hover:preset-tonal'}"
		>
			<Icon size={16} />
			{tab.label}
		</a>
	{/each}
</section>

<!-- Page Content -->
{@render children()}
