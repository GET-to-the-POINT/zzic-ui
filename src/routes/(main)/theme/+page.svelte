<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { themes, getCurrentTheme, setTheme } from '$lib/utils/theme.js';

	let selectedTheme = $state('pinky');

	onMount(() => {
		selectedTheme = page.data.originalTheme || getCurrentTheme();
	});

	function handleThemeChange(theme) {
		selectedTheme = theme;
		setTheme(theme); // 즉시 미리보기 적용
	}
</script>

<main class="p-4 space-y-4">
	{#each themes as theme}
		<button 
			class="theme-item"
			class:selected={selectedTheme === theme.name}
			onclick={() => handleThemeChange(theme.name)}
		>
			<div class="theme-content">
				<span class="theme-label">{theme.label}</span>
				{#if selectedTheme === theme.name}
					<svg class="check-icon" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
					</svg>
				{/if}
			</div>
		</button>
	{/each}
</main>

<style>
	.theme-item {
		background-color: var(--color-surface-100);
		border: 2px solid transparent;
		border-radius: 0.5rem;
		padding: 1rem;
		text-align: left;
		cursor: pointer;
		transition: all 0.2s ease;
		width: 100%;
	}
	
	.theme-item:hover {
		background-color: var(--color-primary-100);
		border-color: var(--color-primary-300);
	}
	
	.theme-item.selected {
		background-color: var(--color-primary-500);
		border-color: var(--color-primary-600);
		color: var(--color-primary-contrast-500);
	}
	
	.theme-item:not(.selected) {
		background-color: var(--color-surface-100);
		color: var(--color-surface-900);
	}
	
	.theme-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.theme-label {
		font-weight: 500;
	}
	
	.check-icon {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--color-primary-500);
	}
</style>