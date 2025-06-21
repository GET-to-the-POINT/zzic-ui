<script>
	import { 
		Calendar, 
		Clock, 
		Tag, 
		AlertCircle, 
		Edit, 
		MoreVertical 
	} from '@lucide/svelte/icons';
	import { 
		formatDate, 
		formatTime, 
		getCategoryColor, 
		getPriorityColor 
	} from '$lib/types/calendar.js';

	// Props using Svelte 5 runes
	let {
		events,
		selectedDate,
		onEventEdit,
		onEventDelete,
		onEventClick
	} = $props();

	// 날짜별 이벤트 필터링 - Derived value using $derived
	const filteredEvents = $derived(selectedDate 
		? events.filter(/** @param {import('$lib/types/calendar.js').CalendarEvent} event */ (event) => {
				const eventDate = new Date(event.startDate);
				return eventDate.getFullYear() === selectedDate.getFullYear() &&
					   eventDate.getMonth() === selectedDate.getMonth() &&
					   eventDate.getDate() === selectedDate.getDate();
		  })
		: events
	);

	// 시간순으로 정렬 - Derived value using $derived
	const sortedEvents = $derived([...filteredEvents].sort((a, b) => {
		if (a.isAllDay && !b.isAllDay) return -1;
		if (!a.isAllDay && b.isAllDay) return 1;
		if (a.isAllDay && b.isAllDay) return 0;
		
		const timeA = a.startTime || '00:00';
		const timeB = b.startTime || '00:00';
		return timeA.localeCompare(timeB);
	}));

	/**
	 * @param {string} priority
	 * @returns {string}
	 */
	function getPriorityColor_for_icon(priority) {
		return getPriorityColor(priority);
	}

	/**
	 * @param {import('$lib/types/calendar.js').CalendarEvent} event
	 * @param {MouseEvent} e
	 */
	function handleDelete(event, e) {
		e.stopPropagation();
		if (confirm('정말로 이 일정을 삭제하시겠습니까?')) {
			onEventDelete(event.id);
		}
	}

	/**
	 * @param {import('$lib/types/calendar.js').CalendarEvent} event
	 * @param {MouseEvent} e
	 */
	function handleEdit(event, e) {
		e.stopPropagation();
		onEventEdit(event);
	}

	// Reactive state using $state
	let openDropdown = $state(/** @type {string | null} */ (null));

	/**
	 * @param {string} eventId
	 */
	function toggleDropdown(eventId) {
		openDropdown = openDropdown === eventId ? null : eventId;
	}
</script>

<div class="card h-full">
	<header class="card-header pb-3">
		<div class="flex items-center space-x-2">
			<Calendar class="w-5 h-5 text-primary-600" />
			<h3 class="h3">
				{selectedDate 
					? `${formatDate(selectedDate)} 일정` 
					: '일정 목록'
				}
			</h3>
			{#if selectedDate}
				<span class="badge preset-tonal-surface ml-auto">
					{sortedEvents.length}개
				</span>
			{/if}
		</div>
	</header>
	
	<div class="p-0">
		<div class="max-h-[600px] overflow-y-auto scrollbar-none">
			{#if !selectedDate}
				<div class="text-center py-12 px-4">
					<Calendar class="w-12 h-12 text-surface-300-700 mx-auto mb-4" />
					<p class="text-surface-500-400 mb-2">
						날짜를 선택해주세요
					</p>
					<p class="text-sm text-surface-400-600">
						캘린더에서 날짜를 클릭하면 해당 날짜의 일정을 확인할 수 있습니다
					</p>
				</div>
			{:else if sortedEvents.length === 0}
				<div class="text-center py-12 px-4">
					<Calendar class="w-12 h-12 text-surface-300-700 mx-auto mb-4" />
					<p class="text-surface-500-400 mb-2">
						이 날짜에는 일정이 없습니다
					</p>
					<p class="text-sm text-surface-400-600">새로운 일정을 추가해보세요!</p>
				</div>
			{:else}
				<div class="space-y-2 p-4">
					{#each sortedEvents as event (event.id)}
						<div
							class="card cursor-pointer hover:shadow-md transition-shadow border-l-4 relative"
							style="border-left-color: {getCategoryColor(event.category)}"
							onclick={() => onEventClick(event)}
							role="button"
							tabindex="0"
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									onEventClick(event);
								}
							}}
						>
							<div class="p-4">
								<div class="flex items-start justify-between">
									<div class="flex-1 min-w-0">
										<!-- 제목과 시간 -->
										<div class="flex items-center space-x-2 mb-2">
											<h4 class="font-medium text-surface-900-50 truncate">
												{event.title}
											</h4>
											<AlertCircle 
												class="w-4 h-4" 
												style="color: {getPriorityColor_for_icon(event.priority)}" 
											/>
										</div>
										
										<!-- 시간 정보 -->
										{#if !event.isAllDay && event.startTime}
											<div class="flex items-center space-x-4 text-sm text-surface-600-400 mb-2">
												<div class="flex items-center space-x-1">
													<Clock class="w-3 h-3" />
													<span>
														{formatTime(event.startTime || '')} - {formatTime(event.endTime || '')}
													</span>
												</div>
											</div>
										{/if}

										<!-- 설명 -->
										{#if event.description}
											<p class="text-sm text-surface-600-400 mb-2 line-clamp-2">
												{event.description}
											</p>
										{/if}

										<!-- 배지들 -->
										<div class="flex items-center space-x-2">
											<span 
												class="badge text-xs px-2 py-1 rounded-full"
												style="background-color: {getCategoryColor(event.category)}20; color: {getCategoryColor(event.category)}; border: 1px solid {getCategoryColor(event.category)}40"
											>
												<Tag class="w-3 h-3 mr-1" />
												{event.category}
											</span>
											
											{#if event.isRecurring}
												<span class="badge preset-outlined text-xs px-2 py-1 rounded-full">
													반복
												</span>
											{/if}
										</div>
									</div>

									<!-- 액션 메뉴 -->
									<div class="relative">
										<button
											class="btn btn-sm p-1 h-6 w-6 rounded-full hover:bg-surface-100-900"
											onclick={(e) => {
												e.stopPropagation();
												toggleDropdown(event.id);
											}}
										>
											<MoreVertical class="w-4 h-4" />
										</button>
										
										{#if openDropdown === event.id}
											<div class="absolute right-0 top-8 z-10 bg-surface-50-950 border border-surface-200-800 rounded-lg shadow-lg py-1 min-w-[120px]">
												<button
													class="w-full px-3 py-2 text-left text-sm hover:bg-surface-100-900 flex items-center"
													onclick={(e) => handleEdit(event, e)}
												>
													<Edit class="w-4 h-4 mr-2" />
													수정
												</button>
												<button
													class="w-full px-3 py-2 text-left text-sm hover:bg-surface-100-900 flex items-center text-error-600"
													onclick={(e) => handleDelete(event, e)}
												>
													<AlertCircle class="w-4 h-4 mr-2" />
													삭제
												</button>
											</div>
										{/if}
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- 클릭 외부 시 드롭다운 닫기 -->
<svelte:window onclick={() => openDropdown = null} />
