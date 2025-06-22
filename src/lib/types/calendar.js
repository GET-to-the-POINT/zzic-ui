// Calendar 타입 정의
/**
 * @typedef {'personal' | 'work' | 'meeting' | 'health' | 'study' | 'deadline' | 'other'} EventCategory
 */

/**
 * @typedef {'high' | 'medium' | 'low'} EventPriority
 */

/**
 * @typedef {'month' | 'week' | 'day' | 'agenda'} CalendarViewType
 */

/**
 * @typedef {Object} CalendarEvent
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {Date} startDate
 * @property {Date} endDate
 * @property {string} [startTime]
 * @property {string} [endTime]
 * @property {boolean} isAllDay
 * @property {EventCategory} category
 * @property {EventPriority} priority
 * @property {string} color
 * @property {boolean} isRecurring
 * @property {string} [recurringType]
 * @property {any[]} reminders
 */

/**
 * @typedef {Object} CalendarState
 * @property {Date} currentDate
 * @property {Date | null} selectedDate
 * @property {CalendarViewType} viewType
 * @property {CalendarEvent[]} events
 * @property {CalendarEvent | null} selectedEvent
 * @property {boolean} isEventDialogOpen
 * @property {boolean} isEditing
 */

// 카테고리 옵션
export const eventCategories = [
	{ value: 'personal', label: '개인', color: '#10B981' },
	{ value: 'work', label: '업무', color: '#3B82F6' },
	{ value: 'meeting', label: '회의', color: '#8B5CF6' },
	{ value: 'health', label: '건강', color: '#F59E0B' },
	{ value: 'study', label: '학습', color: '#EF4444' },
	{ value: 'deadline', label: '마감', color: '#DC2626' },
	{ value: 'other', label: '기타', color: '#6B7280' }
];

// 우선순위 옵션
export const priorityOptions = [
	{ value: 'high', label: '높음', color: '#EF4444' },
	{ value: 'medium', label: '보통', color: '#F59E0B' },
	{ value: 'low', label: '낮음', color: '#10B981' }
];

// 캘린더 뷰 옵션
export const calendarViews = [
	{ type: 'month', label: '월' },
	{ type: 'week', label: '주' },
	{ type: 'day', label: '일' },
	{ type: 'agenda', label: '일정' }
];

// 유틸리티 함수들
/**
 * @param {string} category
 * @returns {string}
 */
export function getCategoryColor(category) {
	const categoryObj = eventCategories.find((cat) => cat.value === category);
	return categoryObj ? categoryObj.color : '#6B7280';
}

/**
 * @param {string} priority
 * @returns {string}
 */
export function getPriorityColor(priority) {
	const priorityObj = priorityOptions.find((pri) => pri.value === priority);
	return priorityObj ? priorityObj.color : '#F59E0B';
}

/**
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
	return date.toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

/**
 * @param {string} time
 * @returns {string}
 */
export function formatTime(time) {
	if (!time) return '';
	const [hours, minutes] = time.split(':');
	return `${hours}:${minutes}`;
}

/**
 * @param {Date} date1
 * @param {Date} date2
 * @returns {boolean}
 */
export function isSameDay(date1, date2) {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
}

/**
 * @param {Date} date
 * @returns {Date[]}
 */
export function getMonthDays(date) {
	const year = date.getFullYear();
	const month = date.getMonth();

	// 해당 월의 첫 날과 마지막 날
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);

	// 캘린더에 표시할 첫 번째 날 (이전 달의 마지막 주 포함)
	const startDate = new Date(firstDay);
	startDate.setDate(startDate.getDate() - startDate.getDay());

	// 캘린더에 표시할 마지막 날 (다음 달의 첫 주 포함)
	const endDate = new Date(lastDay);
	endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

	const days = [];
	const currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		days.push(new Date(currentDate));
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return days;
}

// Mock 데이터
export const mockEvents = /** @type {CalendarEvent[]} */ ([
	{
		id: '1',
		title: '팀 회의',
		description: '주간 스프린트 리뷰 미팅',
		startDate: new Date(2025, 5, 25, 14, 0),
		endDate: new Date(2025, 5, 25, 15, 30),
		startTime: '14:00',
		endTime: '15:30',
		isAllDay: false,
		category: 'meeting',
		priority: 'high',
		color: '#8B5CF6',
		isRecurring: true,
		recurringType: 'weekly',
		reminders: []
	},
	{
		id: '2',
		title: '의사 방문',
		description: '정기 건강 검진',
		startDate: new Date(2025, 5, 28, 10, 0),
		endDate: new Date(2025, 5, 28, 11, 0),
		startTime: '10:00',
		endTime: '11:00',
		isAllDay: false,
		category: 'health',
		priority: 'medium',
		color: '#F59E0B',
		isRecurring: false,
		reminders: []
	},
	{
		id: '3',
		title: '생일 파티',
		description: '친구 생일 축하 파티',
		startDate: new Date(2025, 5, 30),
		endDate: new Date(2025, 5, 30),
		isAllDay: true,
		category: 'personal',
		priority: 'low',
		color: '#10B981',
		isRecurring: false,
		reminders: []
	},
	{
		id: '4',
		title: '프로젝트 마감',
		description: '웹 애플리케이션 개발 완료',
		startDate: new Date(2025, 6, 1),
		endDate: new Date(2025, 6, 1),
		isAllDay: true,
		category: 'deadline',
		priority: 'high',
		color: '#DC2626',
		isRecurring: false,
		reminders: []
	},
	{
		id: '5',
		title: '영어 공부',
		description: '토익 공부 시간',
		startDate: new Date(2025, 5, 26, 19, 0),
		endDate: new Date(2025, 5, 26, 20, 30),
		startTime: '19:00',
		endTime: '20:30',
		isAllDay: false,
		category: 'study',
		priority: 'medium',
		color: '#EF4444',
		isRecurring: true,
		recurringType: 'daily',
		reminders: []
	}
]);
