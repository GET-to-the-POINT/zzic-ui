import { writable } from 'svelte/store';

/**
 * 포모도로 세션 타입
 */
export const SessionType = {
	WORK: 'work',
	SHORT_BREAK: 'short_break',
	LONG_BREAK: 'long_break'
};

/**
 * 포모도로 상태
 */
export const PomodoroState = {
	IDLE: 'idle',
	RUNNING: 'running',
	PAUSED: 'paused',
	COMPLETED: 'completed'
};

/**
 * 기본 설정
 */
const DEFAULT_SETTINGS = {
	workDuration: 25 * 60, // 25분
	shortBreakDuration: 5 * 60, // 5분
	longBreakDuration: 15 * 60, // 15분
	sessionsBeforeLongBreak: 4
};

/**
 * 포모도로 서비스 클래스
 */
class PomodoroService {
	constructor() {
		this.settings = { ...DEFAULT_SETTINGS };
		this.currentSession = 1;
		this.completedSessions = 0;
		this.currentType = SessionType.WORK;
		this.state = PomodoroState.IDLE;
		this.remainingTime = this.settings.workDuration;
		this.startTime = null;
		this.pausedTime = 0;
		this.intervalId = null;

		// 스토어 생성
		this.createStores();

		// 초기 상태 설정
		this.updateStores();
	}

	/**
	 * Svelte 스토어 생성
	 */
	createStores() {
		this.stores = {
			state: writable(this.state),
			currentType: writable(this.currentType),
			remainingTime: writable(this.remainingTime),
			completedSessions: writable(this.completedSessions),
			currentSession: writable(this.currentSession),
			progress: writable(0),
			formattedTime: writable(this.formatTime(this.remainingTime))
		};
	}

	/**
	 * 모든 스토어 업데이트
	 */
	updateStores() {
		this.stores.state.set(this.state);
		this.stores.currentType.set(this.currentType);
		this.stores.remainingTime.set(this.remainingTime);
		this.stores.completedSessions.set(this.completedSessions);
		this.stores.currentSession.set(this.currentSession);
		this.stores.formattedTime.set(this.formatTime(this.remainingTime));

		const totalTime = this.getCurrentSessionDuration();
		const progress = totalTime > 0 ? (totalTime - this.remainingTime) / totalTime : 0;
		this.stores.progress.set(progress);
	}

	/**
	 * 현재 세션의 총 시간 반환
	 */
	getCurrentSessionDuration() {
		switch (this.currentType) {
			case SessionType.WORK:
				return this.settings.workDuration;
			case SessionType.SHORT_BREAK:
				return this.settings.shortBreakDuration;
			case SessionType.LONG_BREAK:
				return this.settings.longBreakDuration;
			default:
				return this.settings.workDuration;
		}
	}

	/**
	 * 타이머 시작
	 */
	async start() {
		try {
			if (this.state === PomodoroState.PAUSED) {
				// 일시정지에서 재개
				this.startTime = Date.now() - this.pausedTime;
				this.pausedTime = 0;
			} else {
				// 새로 시작
				this.startTime = Date.now();
				this.remainingTime = this.getCurrentSessionDuration();
			}

			this.state = PomodoroState.RUNNING;
			this.startTicking();
			this.updateStores();

			// 백엔드에 세션 시작 알림
			await this.notifyBackend('session_started', {
				type: this.currentType,
				duration: this.getCurrentSessionDuration(),
				session: this.currentSession
			});
		} catch (error) {
			console.error('포모도로 시작 실패:', error);
		}
	}

	/**
	 * 타이머 일시정지
	 */
	async pause() {
		try {
			if (this.state !== PomodoroState.RUNNING) return;

			this.state = PomodoroState.PAUSED;
			this.pausedTime = Date.now() - this.startTime;
			this.stopTicking();
			this.updateStores();

			// 백엔드에 일시정지 알림
			await this.notifyBackend('session_paused', {
				type: this.currentType,
				remainingTime: this.remainingTime,
				session: this.currentSession
			});
		} catch (error) {
			console.error('포모도로 일시정지 실패:', error);
		}
	}

	/**
	 * 타이머 중지
	 */
	async stop() {
		try {
			this.state = PomodoroState.IDLE;
			this.remainingTime = this.getCurrentSessionDuration();
			this.startTime = null;
			this.pausedTime = 0;
			this.stopTicking();
			this.updateStores();

			// 백엔드에 중지 알림
			await this.notifyBackend('session_stopped', {
				type: this.currentType,
				session: this.currentSession
			});
		} catch (error) {
			console.error('포모도로 중지 실패:', error);
		}
	}

	/**
	 * 다음 세션으로 건너뛰기
	 */
	async skip() {
		try {
			// 타이머가 실행 중이면 먼저 중지
			this.stopTicking();

			// 현재 세션 완료 처리
			await this.completeCurrentSession();

			// 다음 세션으로 이동
			await this.moveToNextSession();
		} catch (error) {
			console.error('세션 건너뛰기 실패:', error);
		}
	}

	/**
	 * 전체 리셋
	 */
	async reset() {
		try {
			await this.stop();
			this.currentSession = 1;
			this.completedSessions = 0;
			this.currentType = SessionType.WORK;
			this.remainingTime = this.settings.workDuration;
			this.updateStores();

			// 백엔드에 리셋 알림
			await this.notifyBackend('pomodoro_reset', {});
		} catch (error) {
			console.error('포모도로 리셋 실패:', error);
		}
	}

	/**
	 * 틱 시작
	 */
	startTicking() {
		this.stopTicking(); // 중복 방지

		this.intervalId = setInterval(() => {
			const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
			const sessionDuration = this.getCurrentSessionDuration();
			this.remainingTime = Math.max(0, sessionDuration - elapsed);

			if (this.remainingTime === 0) {
				this.handleSessionComplete();
			} else {
				this.updateStores();
			}
		}, 100);
	}

	/**
	 * 틱 중지
	 */
	stopTicking() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	/**
	 * 세션 완료 처리
	 */
	async handleSessionComplete() {
		try {
			this.stopTicking();
			this.state = PomodoroState.COMPLETED;

			await this.completeCurrentSession();

			// 알림 표시
			this.showNotification();

			// 다음 세션으로 이동
			setTimeout(async () => {
				await this.moveToNextSession();
			}, 1000);
		} catch (error) {
			console.error('세션 완료 처리 실패:', error);
		}
	}

	/**
	 * 현재 세션 완료 처리
	 */
	async completeCurrentSession() {
		try {
			if (this.currentType === SessionType.WORK) {
				this.completedSessions++;
			}

			// 백엔드에 세션 완료 알림
			await this.notifyBackend('session_completed', {
				type: this.currentType,
				session: this.currentSession,
				completedSessions: this.completedSessions,
				duration: this.getCurrentSessionDuration()
			});
		} catch (error) {
			console.error('세션 완료 알림 실패:', error);
		}
	}

	/**
	 * 다음 세션으로 이동
	 */
	async moveToNextSession() {
		try {
			// 다음 세션 타입 결정
			if (this.currentType === SessionType.WORK) {
				if (this.completedSessions % this.settings.sessionsBeforeLongBreak === 0) {
					this.currentType = SessionType.LONG_BREAK;
				} else {
					this.currentType = SessionType.SHORT_BREAK;
				}
			} else {
				this.currentType = SessionType.WORK;
				this.currentSession++;
			}

			// 상태 초기화
			this.state = PomodoroState.IDLE;
			this.remainingTime = this.getCurrentSessionDuration();
			this.startTime = null;
			this.pausedTime = 0;

			this.updateStores();

			// 백엔드에 새 세션 알림
			await this.notifyBackend('session_changed', {
				type: this.currentType,
				session: this.currentSession,
				completedSessions: this.completedSessions
			});
		} catch (error) {
			console.error('다음 세션 이동 실패:', error);
		}
	}

	/**
	 * 알림 표시
	 */
	showNotification() {
		if ('Notification' in window && Notification.permission === 'granted') {
			const messages = {
				[SessionType.WORK]: '🎉 집중 시간 완료! 휴식하세요.',
				[SessionType.SHORT_BREAK]: '⏰ 짧은 휴식 끝! 다시 집중해봐요.',
				[SessionType.LONG_BREAK]: '💪 긴 휴식 끝! 새로운 세트를 시작해요.'
			};

			new Notification('ZZIC 포모도로', {
				body: messages[this.currentType] || '세션이 완료되었습니다.',
				icon: '/favicon.png'
			});
		}
	}

	/**
	 * 백엔드에 이벤트 알림
	 */
	async notifyBackend(eventType, data) {
		try {
			// 실제 API 호출로 대체 가능
			const eventData = {
				type: eventType,
				timestamp: new Date().toISOString(),
				data: {
					...data,
					settings: this.settings
				}
			};

			// 로컬 스토리지에 기록 (백엔드 대신)
			this.saveToLocalStorage(eventType, eventData);

			// TODO: 실제 백엔드 API 호출
			// await fetch('/api/pomodoro/events', {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify(eventData)
			// });

			console.log(`Pomodoro Event: ${eventType}`, eventData);
		} catch (error) {
			console.error('백엔드 알림 실패:', error);
		}
	}

	/**
	 * 로컬 스토리지에 데이터 저장
	 */
	saveToLocalStorage(eventType, data) {
		try {
			const key = `pomodoro_${eventType}_${Date.now()}`;
			localStorage.setItem(key, JSON.stringify(data));

			// 최근 10개 이벤트만 유지
			const keys = Object.keys(localStorage)
				.filter((key) => key.startsWith('pomodoro_'))
				.sort()
				.reverse();

			if (keys.length > 10) {
				keys.slice(10).forEach((key) => localStorage.removeItem(key));
			}
		} catch (error) {
			console.error('로컬 스토리지 저장 실패:', error);
		}
	}

	/**
	 * 시간 포맷팅
	 */
	formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	/**
	 * 설정 업데이트
	 */
	updateSettings(newSettings) {
		this.settings = { ...this.settings, ...newSettings };

		// 현재 IDLE 상태라면 시간 업데이트
		if (this.state === PomodoroState.IDLE) {
			this.remainingTime = this.getCurrentSessionDuration();
			this.updateStores();
		}
	}

	/**
	 * 현재 상태 반환
	 */
	getState() {
		return {
			state: this.state,
			currentType: this.currentType,
			remainingTime: this.remainingTime,
			completedSessions: this.completedSessions,
			currentSession: this.currentSession,
			settings: this.settings
		};
	}

	/**
	 * 정리
	 */
	destroy() {
		this.stopTicking();
	}
}

// 싱글톤 인스턴스
let pomodoroServiceInstance = null;

/**
 * 포모도로 서비스 인스턴스 반환
 */
export function getPomodoroService() {
	if (!pomodoroServiceInstance) {
		pomodoroServiceInstance = new PomodoroService();
	}
	return pomodoroServiceInstance;
}

/**
 * 알림 권한 요청
 */
export function requestNotificationPermission() {
	if ('Notification' in window && Notification.permission === 'default') {
		Notification.requestPermission();
	}
}
