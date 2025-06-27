<script module>
        import { defineMeta } from '@storybook/addon-svelte-csf';
        import CalendarWidget from '$lib/components/calendar/CalendarWidget.svelte';
        import { mockEvents } from '$lib/types/calendar.js';

        const { Story } = defineMeta({
                title: 'Calendar/CalendarWidget',
                component: CalendarWidget,
                argTypes: {
                        events: { control: 'object' },
                        onEventClick: { action: 'eventClick' },
                        onViewAll: { action: 'viewAll' }
                }
        });
</script>

<Story name="기본" args={{ events: mockEvents, onEventClick: () => {}, onViewAll: () => {} }}>
        {#snippet children({ args })}
                <div class="max-w-sm">
                        <CalendarWidget {...args} />
                </div>
        {/snippet}
</Story>

<Story name="이벤트 없음" args={{ events: [], onEventClick: () => {}, onViewAll: () => {} }}>
        {#snippet children({ args })}
                <div class="max-w-sm">
                        <CalendarWidget {...args} />
                </div>
        {/snippet}
</Story>

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
>
        {#snippet children({ args })}
                <div class="max-w-sm">
                        <CalendarWidget {...args} />
                </div>
        {/snippet}
</Story>
