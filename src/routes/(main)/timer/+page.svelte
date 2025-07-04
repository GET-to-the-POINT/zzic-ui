<script>
	import SimplePomodoro from '$lib/components/ui/timer/SimplePomodoro.svelte';
	import TodoItem from '$lib/components/widgets/todos/TodoItem.svelte';
	
	// Props
	let { data } = $props();
	
	function handleTimerComplete() {
		// 타이머 완료시 알림
		if ('Notification' in window && Notification.permission === 'granted') {
			new Notification('타이머 완료!', {
				body: '설정한 시간이 끝났습니다.',
				icon: '/favicon.png'
			});
		}
		// 완료 사운드 재생
		const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKzn4blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
		audio.play();
	}
</script>

<main class="container mx-auto space-y-6">
	<!-- 타이머 섹션 -->
	<SimplePomodoro onComplete={handleTimerComplete} />
	
	<!-- 오늘의 투두 섹션 -->
	<section class="card preset-filled-surface-50-950 p-6">
		<h2 class="h4 font-bold mb-4">오늘의 할 일</h2>
		
		{#if data.todayTodos.length > 0}
			<div class="space-y-2">
				{#each data.todayTodos as todo}
					<TodoItem {todo} />
				{/each}
			</div>
		{:else}
			<p class="text-center text-surface-600-300 py-8">
				오늘 등록된 할 일이 없습니다.
			</p>
		{/if}
	</section>
</main>