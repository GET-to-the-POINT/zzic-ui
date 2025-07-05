<script>
	import SimplePomodoro from '$lib/components/ui/timer/SimplePomodoro.svelte';
	import TodayTodos from '$lib/components/ui/common/TodayTodos.svelte';

	function handleTimerComplete() {
		// 타이머 완료시 알림
		if ('Notification' in window && Notification.permission === 'granted') {
			new Notification('타이머 완료!', {
				body: '설정한 시간이 끝났습니다.',
				icon: '/favicon.png'
			});
		}
		// 완료 사운드 재생
		const audio = new Audio(
			'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKzn4blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
		);
		audio.play();
	}
</script>

<main class="p-4 space-y-4">
	<!-- 타이머 섹션 -->
	<SimplePomodoro onComplete={handleTimerComplete} />

	<!-- 오늘의 투두 섹션 -->
	<TodayTodos title="오늘의 할 일" />
</main>
