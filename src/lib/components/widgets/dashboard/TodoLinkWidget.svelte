<script>
	import { CheckSquare } from '@lucide/svelte';
	import LinkWidget from './LinkWidget.svelte';
</script>

<LinkWidget
	title="할 일"
	description="오늘의 할 일을 관리하세요"
	href="/todos"
	icon={CheckSquare}
/>
