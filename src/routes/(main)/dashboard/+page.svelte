<script>
	import CalendarComponent from '$lib/components/widgets/calendar/CalendarWidget.svelte';
	import ChallengeLinkWidget from '$lib/components/widgets/dashboard/ChallengeLinkWidget.svelte';
	import NoteLinkWidget from '$lib/components/widgets/dashboard/NoteLinkWidget.svelte';
	import TodoLinkWidget from '$lib/components/widgets/dashboard/TodoLinkWidget.svelte';
	import UserInfoWidget from '$lib/components/widgets/user/UserInfoWidget.svelte';
</script>

<svelte:head>
	<title>대시보드 - ZZIC</title>
</svelte:head>

<!-- 사용자 정보 위젯 -->
<UserInfoWidget variant="compact" />

<!-- 링크 위젯 그리드 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
	<TodoLinkWidget />
	<ChallengeLinkWidget />
	<NoteLinkWidget />
</div>

<!-- 캘린더 위젯 -->
<CalendarComponent />
