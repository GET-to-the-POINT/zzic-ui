<script>
	import CalendarComponent from '$lib/components/ui/common/CalendarComponent.svelte';
	import { goto } from '$app/navigation';

	const { data } = $props();

	function handlePrevMonth() {
		goto(`/calendar?date=${data.navigation.prevMonth}`);
	}

	function handleNextMonth() {
		goto(`/calendar?date=${data.navigation.nextMonth}`);
	}
</script>

<CalendarComponent
	currentMonth={data.currentMonth}
	weekDays={data.weekDays}
	monthlyTodos={data.monthlyTodos}
	navigation={data.navigation}
	onPrevMonth={handlePrevMonth}
	onNextMonth={handleNextMonth}
	showNavigation={true}
	compact={false}
/>
