<script>
	import { goto } from '$app/navigation';

	let { 
		title, 
		description, 
		href, 
		icon: Icon
	} = $props();

	function handleClick() {
		goto(href);
	}
</script>

<button
	type="button"
	onclick={handleClick}
	class="card p-6 cursor-pointer hover:scale-[1.02] transition-transform preset-filled-surface-50-950 w-full text-left"
>
	<div class="flex items-center gap-4">
		{#if Icon}
			<div class="flex-shrink-0">
				<Icon size={32} />
			</div>
		{/if}
		<div class="flex-1">
			<h3 class="text-lg font-semibold">{title}</h3>
			{#if description}
				<p class="text-sm opacity-90 mt-1">{description}</p>
			{/if}
		</div>
	</div>
</button>