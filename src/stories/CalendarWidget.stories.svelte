<script>
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import CalendarWidget from '$lib/components/calendar/CalendarWidget.svelte';
	import { mockEvents } from '$lib/types/calendar.js';
</script>

<Meta
	title="Calendar/CalendarWidget"
	component={CalendarWidget}
	argTypes={{
		events: { control: 'object' },
		onEventClick: { action: 'eventClick' },
		onViewAll: { action: 'viewAll' }
	}}
/>

<Template let:args>
	<div class="max-w-sm">
		<CalendarWidget {...args} />
	</div>
</Template>

<Story
	name="기본"
	args={{
		events: mockEvents,
		onEventClick: () => {},
		onViewAll: () => {}
	}}
/>

<Story
	name="이벤트 없음"
	args={{
		events: [],
		onEventClick: () => {},
		onViewAll: () => {}
	}}
/>

<Story
	name="많은 이벤트"
	args={{
		events: [
			...mockEvents,
			...mockEvents.map((event, index) => ({
				...event,
				id: `extra-${index}`,
				title: `추가 이벤트 ${index + 1}`,
				startDate: new Date(2025, 5, 20 + index)
			}))
		],
		onEventClick: () => {},
		onViewAll: () => {}
	}}
/>
