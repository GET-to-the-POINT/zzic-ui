<script>
	import { Drawer as DrawerPrimitive } from 'vaul-svelte';

	let {
		shouldScaleBackground = true,
		open = $bindable(false),
		activeSnapPoint = $bindable(null),
		...restProps
	} = $props();
</script>

<DrawerPrimitive.Root {shouldScaleBackground} bind:open bind:activeSnapPoint {...restProps} />
