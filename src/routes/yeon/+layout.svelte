<script>
	import "$lib/yeon/yeon.css";

	const { children } = $props();
</script>

<div class="container">
	{@render children()}
</div>