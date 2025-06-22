<script>
	import CalendarHeader from '$lib/components/calendar/CalendarHeader.svelte';
	import MonthView from '$lib/components/calendar/MonthView.svelte';
	import EventDialog from '$lib/components/calendar/EventDialog.svelte';
	import EventList from '$lib/components/calendar/EventList.svelte';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	/**
	 * @typedef {import('$lib/types/calendar.js').CalendarState} CalendarState
	 * @typedef {import('$lib/types/calendar.js').CalendarEvent} CalendarEvent
	 */

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	// TODO 데이터를 캘린더 이벤트로 변환하는 함수
	/**
	 * @param {any} todo
	 * @returns {CalendarEvent}
	 */
	function todoToEvent(todo) {
		return {
			id: todo.id,
			title: todo.title,
			description: todo.description || '',
			startDate: todo.dueDate ? new Date(todo.dueDate) : new Date(),
			endDate: todo.dueDate ? new Date(todo.dueDate) : new Date(),
			isAllDay: true, // TODO는 보통 종일 일정으로 처리
			category: todo.category?.name || 'other',
			priority: todo.priority?.name || 'medium',
			color: todo.category?.color || '#6B7280',
			isRecurring: false,
			reminders: []
		};
	}

	// 캘린더 이벤트를 TODO 생성 데이터로 변환하는 함수
	/**
	 * @param {Omit<CalendarEvent, 'id'>} event
	 * @returns {Object}
	 */
	function eventToTodoCreate(event) {
		// 카테고리 찾기
		const category = data.categoryPage?.content?.find(
			(cat) =>
				cat.name === event.category || cat.name.toLowerCase() === event.category.toLowerCase()
		);

		// 우선순위 찾기
		const priority = /** @type {any[]} */ (data.priorityResponse)?.find(
			/** @param {any} pri */ (pri) =>
				pri.name === event.priority || pri.name.toLowerCase() === event.priority.toLowerCase()
		);

		return {
			title: event.title,
			description: event.description || '',
			dueDate: event.startDate.toISOString().split('T')[0], // YYYY-MM-DD 형식
			categoryId: category?.id || null,
			priorityId: priority?.id || null,
			tagIds: []
		};
	}

	// 캘린더 이벤트를 TODO 업데이트 데이터로 변환하는 함수
	/**
	 * @param {CalendarEvent} event
	 * @returns {Object}
	 */
	function eventToTodoUpdate(event) {
		const category = data.categoryPage?.content?.find(
			(cat) =>
				cat.name === event.category || cat.name.toLowerCase() === event.category.toLowerCase()
		);

		const priority = /** @type {any[]} */ (data.priorityResponse)?.find(
			/** @param {any} pri */ (pri) =>
				pri.name === event.priority || pri.name.toLowerCase() === event.priority.toLowerCase()
		);

		return {
			title: event.title,
			description: event.description || '',
			dueDate: event.startDate.toISOString().split('T')[0],
			categoryId: category?.id || null,
			priorityId: priority?.id || null,
			tagIds: []
		};
	}

	// TODO 데이터를 이벤트로 변환 - Derived value using $derived
	const todoEvents = $derived(data.todoPage?.content ? data.todoPage.content.map(todoToEvent) : []);

	// URL 쿼리 파라미터에서 초기 날짜 설정
	function getInitialDate() {
		const dateParam = $page.url.searchParams.get('date');
		if (dateParam) {
			const parsedDate = new Date(dateParam);
			if (!isNaN(parsedDate.getTime())) {
				return parsedDate;
			}
		}
		return new Date();
	}

	// Reactive state using $state
	let calendarState = $state({
		currentDate: getInitialDate(),
		selectedDate: /** @type {Date | null} */ (null),
		viewType: /** @type {'month' | 'week' | 'day' | 'agenda'} */ ('month'),
		selectedEvent: /** @type {CalendarEvent | null} */ (null),
		isEventDialogOpen: false,
		isEditing: false
	});

	// Derived value for current events
	const currentEvents = $derived(todoEvents);

	// TODO 데이터가 변경되면 이벤트도 업데이트
	$effect(() => {
		// todoEvents는 이미 $derived로 처리되므로 별다른 처리 불필요
	});

	// URL 변경 감지를 위한 reactive statement
	$effect(() => {
		const dateParam = $page.url.searchParams.get('date');
		if (dateParam) {
			const parsedDate = new Date(dateParam);
			if (!isNaN(parsedDate.getTime())) {
				calendarState = {
					...calendarState,
					selectedDate: parsedDate,
					currentDate: new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1)
				};
			}
		} else {
			// 날짜 파라미터가 없으면 선택 해제 (초기 상태는 선택되지 않음)
			calendarState = {
				...calendarState,
				selectedDate: null
			};
		}
	});

	// 대시보드에서 전달된 선택된 이벤트가 있는지 확인
	onMount(() => {
		const selectedEvent = history.state?.selectedEvent;
		if (selectedEvent) {
			handleEventClick(selectedEvent);
		}
	});

	/**
	 * @param {Date} date
	 */
	function handleDateChange(date) {
		calendarState = { ...calendarState, currentDate: date };
	}

	/**
	 * @param {'month' | 'week' | 'day' | 'agenda'} viewType
	 */
	function handleViewChange(viewType) {
		calendarState = { ...calendarState, viewType };
	}

	/**
	 * @param {Date} date
	 */
	function handleDateSelect(date) {
		const isCurrentlySelected =
			calendarState.selectedDate && calendarState.selectedDate.getTime() === date.getTime();

		const newSelectedDate = isCurrentlySelected ? null : date;

		calendarState = {
			...calendarState,
			selectedDate: newSelectedDate
		};

		// URL 업데이트
		const url = new URL(window.location.href);
		if (newSelectedDate) {
			url.searchParams.set('date', newSelectedDate.toISOString().split('T')[0]);
		} else {
			url.searchParams.delete('date');
		}

		// 브라우저 히스토리 업데이트 (페이지 새로고침 없이)
		window.history.pushState({}, '', url.toString());
	}

	function handleAddEvent() {
		calendarState = {
			...calendarState,
			isEventDialogOpen: true,
			isEditing: false,
			selectedEvent: null
		};
	}

	/**
	 * @param {CalendarEvent} event
	 */
	function handleEventClick(event) {
		calendarState = {
			...calendarState,
			selectedEvent: event,
			isEventDialogOpen: true,
			isEditing: true
		};
	}

	/**
	 * @param {Omit<CalendarEvent, 'id'>} eventData
	 */
	function handleEventSave(eventData) {
		const todoData = eventToTodoCreate(eventData);

		// form 생성해서 submit
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '?/create';
		form.style.display = 'none';

		Object.entries(todoData).forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				const input = document.createElement('input');
				input.type = 'hidden';
				input.name = key;
				input.value = String(value);
				form.appendChild(input);
			}
		});

		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);

		calendarState = {
			...calendarState,
			isEventDialogOpen: false
		};
	}

	/**
	 * @param {CalendarEvent} updatedEvent
	 */
	function handleEventUpdate(updatedEvent) {
		const todoData = eventToTodoUpdate(updatedEvent);

		// form 생성해서 submit
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '?/update';
		form.style.display = 'none';

		// ID 추가
		const idInput = document.createElement('input');
		idInput.type = 'hidden';
		idInput.name = 'id';
		idInput.value = updatedEvent.id;
		form.appendChild(idInput);

		Object.entries(todoData).forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				const input = document.createElement('input');
				input.type = 'hidden';
				input.name = key;
				input.value = String(value);
				form.appendChild(input);
			}
		});

		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);

		calendarState = {
			...calendarState,
			isEventDialogOpen: false
		};
	}

	/**
	 * @param {string} eventId
	 */
	function handleEventDelete(eventId) {
		// form 생성해서 submit
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '?/delete';
		form.style.display = 'none';

		const idInput = document.createElement('input');
		idInput.type = 'hidden';
		idInput.name = 'id';
		idInput.value = eventId;
		form.appendChild(idInput);

		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);

		calendarState = {
			...calendarState,
			isEventDialogOpen: false
		};
	}

	function handleToday() {
		const today = new Date();
		calendarState = {
			...calendarState,
			currentDate: today,
			selectedDate: today
		};

		// URL 업데이트
		const url = new URL(window.location.href);
		url.searchParams.set('date', today.toISOString().split('T')[0]);
		window.history.pushState({}, '', url.toString());
	}

	function handleCloseDialog() {
		calendarState = {
			...calendarState,
			isEventDialogOpen: false,
			selectedEvent: null,
			isEditing: false
		};
	}
</script>

<svelte:head>
	<title>캘린더 - ZZIC</title>
</svelte:head>

<main class="min-h-screen bg-surface-50-950">
	<div class="max-w-7xl mx-auto">
		<!-- 헤더 -->
		<CalendarHeader
			currentDate={calendarState.currentDate}
			viewType={calendarState.viewType}
			onDateChange={handleDateChange}
			onViewChange={handleViewChange}
			onAddEvent={handleAddEvent}
			onToday={handleToday}
		/>

		<!-- 메인 콘텐츠 -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
			<!-- 캘린더 뷰 -->
			<div class="lg:col-span-2">
				{#if calendarState.viewType === 'month'}
					<MonthView
						currentDate={calendarState.currentDate}
						events={currentEvents}
						selectedDate={calendarState.selectedDate}
						onDateSelect={handleDateSelect}
						onEventClick={handleEventClick}
					/>
				{:else if calendarState.viewType === 'week'}
					<div class="bg-surface-50-950 rounded-lg border border-surface-200-800 p-8 text-center">
						<h3 class="text-lg font-medium text-surface-900-50 mb-2">주간 뷰</h3>
						<p class="text-surface-600-400">주간 캘린더 뷰가 곧 준비됩니다!</p>
					</div>
				{:else if calendarState.viewType === 'day'}
					<div class="bg-surface-50-950 rounded-lg border border-surface-200-800 p-8 text-center">
						<h3 class="text-lg font-medium text-surface-900-50 mb-2">일간 뷰</h3>
						<p class="text-surface-600-400">일간 캘린더 뷰가 곧 준비됩니다!</p>
					</div>
				{:else if calendarState.viewType === 'agenda'}
					<div class="bg-surface-50-950 rounded-lg border border-surface-200-800 p-8 text-center">
						<h3 class="text-lg font-medium text-surface-900-50 mb-2">일정 뷰</h3>
						<p class="text-surface-600-400">일정 목록 뷰가 곧 준비됩니다!</p>
					</div>
				{/if}
			</div>

			<!-- 이벤트 목록 -->
			<div class="lg:col-span-1">
				<EventList
					events={currentEvents}
					selectedDate={calendarState.selectedDate}
					onEventEdit={handleEventClick}
					onEventDelete={handleEventDelete}
					onEventClick={handleEventClick}
				/>
			</div>
		</div>

		<!-- 이벤트 다이얼로그 -->
		<EventDialog
			bind:isOpen={calendarState.isEventDialogOpen}
			onClose={handleCloseDialog}
			onSave={handleEventSave}
			onUpdate={handleEventUpdate}
			onDelete={handleEventDelete}
			selectedDate={calendarState.selectedDate}
			existingEvent={calendarState.selectedEvent}
			isEditing={calendarState.isEditing}
			categories={data.categoryPage?.content}
			priorities={data.priorityResponse}
		/>
	</div>
</main>
