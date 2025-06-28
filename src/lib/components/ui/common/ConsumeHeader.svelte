<script>
	import X from '@lucide/svelte/icons/x';
	import Check from '@lucide/svelte/icons/check';
	let { title, formId } = $props();
	function goBack() {
		window.history.back();
	}
</script>

<header class="preset-filled-primary-500 p-4 h-12 flex items-center justify-between">
	<button type="button" class="btn-icon w-6 h-6" onclick={goBack}>
		<X class="w-6 h-6" />
	</button>
	<h1 class="text-2xl font-semibold uppercase">{title}</h1>
	<button type="submit" class="btn-icon w-6 h-6" form={formId}>
		<Check class="w-6 h-6" />
	</button>
</header>
