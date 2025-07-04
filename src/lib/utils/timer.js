import { writable, derived } from 'svelte/store';

/**
 * 타이머 상태를 나타내는 enum
 * @readonly
 * @enum {string}
 */
export const TimerState = {
	IDLE: 'idle',
	RUNNING: 'running',
	PAUSED: 'paused',
	COMPLETED: 'completed'
};

/**
 * 타이머 타입을 나타내는 enum
 * @readonly
 * @enum {string}
 */
export const TimerType = {
	REGULAR: 'regular',
	POMODORO: 'pomodoro',
	SHORT_BREAK: 'short_break',
	LONG_BREAK: 'long_break'
};

/**
 * 포모도로 타이머 기본 설정 (분 단위)
 */
export const POMODORO_DEFAULTS = {
	pomodoro: 25,
	shortBreak: 5,
	longBreak: 15,
	sessionsBeforeLongBreak: 4
};

/**
 * 타이머 유틸리티 클래스
 */
export class Timer {
	/**
	 * @param {Object} options - 타이머 옵션
	 * @param {number} options.duration - 타이머 지속 시간 (초 단위)
	 * @param {TimerType} options.type - 타이머 타입
	 * @param {Function} options.onComplete - 타이머 완료 시 콜백
	 * @param {Function} options.onTick - 매 초마다 호출되는 콜백
	 */
	constructor({ duration = 60, type = TimerType.REGULAR, onComplete, onTick } = {}) {
		this.duration = duration;
		this.type = type;
		this.onComplete = onComplete;
		this.onTick = onTick;
		
		// 내부 상태
		this._remainingTime = duration;
		this._state = TimerState.IDLE;
		this._intervalId = null;
		this._startTime = null;
		this._pausedTime = 0;
	}

	/**
	 * 타이머 시작
	 */
	start() {
		if (this._state === TimerState.RUNNING) return;

		if (this._state === TimerState.PAUSED) {
			// 일시정지 상태에서 재개
			this._startTime = Date.now() - this._pausedTime;
		} else {
			// 새로 시작
			this._startTime = Date.now();
			this._remainingTime = this.duration;
			this._pausedTime = 0;
		}

		this._state = TimerState.RUNNING;
		
		this._intervalId = setInterval(() => {
			const elapsed = Math.floor((Date.now() - this._startTime) / 1000);
			this._remainingTime = Math.max(0, this.duration - elapsed);

			if (this.onTick) {
				this.onTick({
					remainingTime: this._remainingTime,
					elapsed,
					progress: elapsed / this.duration
				});
			}

			if (this._remainingTime === 0) {
				this.complete();
			}
		}, 100); // 100ms 간격으로 업데이트
	}

	/**
	 * 타이머 일시정지
	 */
	pause() {
		if (this._state !== TimerState.RUNNING) return;

		this._state = TimerState.PAUSED;
		this._pausedTime = Date.now() - this._startTime;
		
		if (this._intervalId) {
			clearInterval(this._intervalId);
			this._intervalId = null;
		}
	}

	/**
	 * 타이머 중지 (초기화)
	 */
	stop() {
		this._state = TimerState.IDLE;
		this._remainingTime = this.duration;
		this._pausedTime = 0;
		this._startTime = null;
		
		if (this._intervalId) {
			clearInterval(this._intervalId);
			this._intervalId = null;
		}
	}

	/**
	 * 타이머 완료 처리
	 */
	complete() {
		this._state = TimerState.COMPLETED;
		
		if (this._intervalId) {
			clearInterval(this._intervalId);
			this._intervalId = null;
		}

		if (this.onComplete) {
			this.onComplete({
				type: this.type,
				duration: this.duration
			});
		}
	}

	/**
	 * 현재 남은 시간 반환
	 * @returns {number} 남은 시간 (초)
	 */
	getRemainingTime() {
		return this._remainingTime;
	}

	/**
	 * 현재 상태 반환
	 * @returns {TimerState} 타이머 상태
	 */
	getState() {
		return this._state;
	}

	/**
	 * 타이머 정리
	 */
	destroy() {
		this.stop();
	}
}

/**
 * 포모도로 타이머 매니저
 */
export class PomodoroTimer {
	/**
	 * @param {Object} options - 포모도로 타이머 옵션
	 * @param {number} options.pomodoroDuration - 포모도로 지속 시간 (분)
	 * @param {number} options.shortBreakDuration - 짧은 휴식 시간 (분)
	 * @param {number} options.longBreakDuration - 긴 휴식 시간 (분)
	 * @param {number} options.sessionsBeforeLongBreak - 긴 휴식 전 세션 수
	 * @param {Function} options.onSessionComplete - 세션 완료 콜백
	 * @param {Function} options.onTick - 틱 콜백
	 */
	constructor({
		pomodoroDuration = POMODORO_DEFAULTS.pomodoro,
		shortBreakDuration = POMODORO_DEFAULTS.shortBreak,
		longBreakDuration = POMODORO_DEFAULTS.longBreak,
		sessionsBeforeLongBreak = POMODORO_DEFAULTS.sessionsBeforeLongBreak,
		onSessionComplete,
		onTick
	} = {}) {
		this.pomodoroDuration = pomodoroDuration * 60; // 초로 변환
		this.shortBreakDuration = shortBreakDuration * 60;
		this.longBreakDuration = longBreakDuration * 60;
		this.sessionsBeforeLongBreak = sessionsBeforeLongBreak;
		this.onSessionComplete = onSessionComplete;
		this.onTick = onTick;

		this.completedSessions = 0;
		this.currentTimer = null;
		this.currentType = TimerType.POMODORO;
	}

	/**
	 * 현재 세션 시작
	 */
	start() {
		if (this.currentTimer) {
			this.currentTimer.start();
			return;
		}

		const duration = this._getDurationForType(this.currentType);
		
		this.currentTimer = new Timer({
			duration,
			type: this.currentType,
			onComplete: (data) => this._handleSessionComplete(data),
			onTick: this.onTick
		});

		this.currentTimer.start();
	}

	/**
	 * 일시정지
	 */
	pause() {
		if (this.currentTimer) {
			this.currentTimer.pause();
		}
	}

	/**
	 * 중지 (현재 세션 리셋)
	 */
	stop() {
		if (this.currentTimer) {
			this.currentTimer.stop();
			this.currentTimer = null;
		}
	}

	/**
	 * 다음 세션으로 건너뛰기
	 */
	skipToNext() {
		if (this.currentTimer) {
			this.currentTimer.stop();
			this.currentTimer = null;
		}
		
		this._nextSession();
		this.start();
	}

	/**
	 * 전체 리셋
	 */
	reset() {
		this.stop();
		this.completedSessions = 0;
		this.currentType = TimerType.POMODORO;
	}

	/**
	 * 세션 완료 처리
	 * @private
	 */
	_handleSessionComplete(data) {
		if (this.currentType === TimerType.POMODORO) {
			this.completedSessions++;
		}

		if (this.onSessionComplete) {
			this.onSessionComplete({
				...data,
				completedSessions: this.completedSessions
			});
		}

		this.currentTimer = null;
		this._nextSession();
	}

	/**
	 * 다음 세션 타입 결정
	 * @private
	 */
	_nextSession() {
		if (this.currentType === TimerType.POMODORO) {
			// 포모도로 후 휴식
			if (this.completedSessions % this.sessionsBeforeLongBreak === 0) {
				this.currentType = TimerType.LONG_BREAK;
			} else {
				this.currentType = TimerType.SHORT_BREAK;
			}
		} else {
			// 휴식 후 포모도로
			this.currentType = TimerType.POMODORO;
		}
	}

	/**
	 * 타입별 지속 시간 반환
	 * @private
	 */
	_getDurationForType(type) {
		switch (type) {
			case TimerType.POMODORO:
				return this.pomodoroDuration;
			case TimerType.SHORT_BREAK:
				return this.shortBreakDuration;
			case TimerType.LONG_BREAK:
				return this.longBreakDuration;
			default:
				return this.pomodoroDuration;
		}
	}

	/**
	 * 현재 상태 가져오기
	 */
	getState() {
		return {
			type: this.currentType,
			completedSessions: this.completedSessions,
			remainingTime: this.currentTimer ? this.currentTimer.getRemainingTime() : 0,
			state: this.currentTimer ? this.currentTimer.getState() : TimerState.IDLE
		};
	}

	/**
	 * 타이머 정리
	 */
	destroy() {
		if (this.currentTimer) {
			this.currentTimer.destroy();
		}
	}
}

/**
 * Svelte 스토어를 사용한 타이머 생성
 * @param {number} initialDuration - 초기 지속 시간 (초)
 * @returns {Object} 타이머 스토어와 메서드
 */
export function createTimerStore(initialDuration = 60) {
	const duration = writable(initialDuration);
	const remainingTime = writable(initialDuration);
	const state = writable(TimerState.IDLE);
	const type = writable(TimerType.REGULAR);
	
	let timer = null;

	const formattedTime = derived(remainingTime, ($remainingTime) => {
		const minutes = Math.floor($remainingTime / 60);
		const seconds = $remainingTime % 60;
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	});

	const progress = derived(
		[remainingTime, duration],
		([$remainingTime, $duration]) => {
			if ($duration === 0) return 0;
			return 1 - ($remainingTime / $duration);
		}
	);

	function start() {
		if (timer) timer.destroy();
		
		const currentDuration = get(duration);
		const currentType = get(type);
		
		timer = new Timer({
			duration: currentDuration,
			type: currentType,
			onTick: ({ remainingTime: remaining }) => {
				remainingTime.set(remaining);
			},
			onComplete: () => {
				state.set(TimerState.COMPLETED);
			}
		});

		timer.start();
		state.set(TimerState.RUNNING);
	}

	function pause() {
		if (timer) {
			timer.pause();
			state.set(TimerState.PAUSED);
		}
	}

	function stop() {
		if (timer) {
			timer.stop();
			timer = null;
		}
		remainingTime.set(get(duration));
		state.set(TimerState.IDLE);
	}

	function setDuration(newDuration) {
		duration.set(newDuration);
		if (get(state) === TimerState.IDLE) {
			remainingTime.set(newDuration);
		}
	}

	function destroy() {
		if (timer) {
			timer.destroy();
		}
	}

	return {
		// 스토어
		duration: { subscribe: duration.subscribe },
		remainingTime: { subscribe: remainingTime.subscribe },
		state: { subscribe: state.subscribe },
		type: { subscribe: type.subscribe },
		formattedTime: { subscribe: formattedTime.subscribe },
		progress: { subscribe: progress.subscribe },
		
		// 메서드
		start,
		pause,
		stop,
		setDuration,
		destroy
	};
}

/**
 * 시간을 형식화하는 유틸리티 함수
 * @param {number} seconds - 초
 * @returns {string} 형식화된 시간 문자열
 */
export function formatTime(seconds) {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}
	return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 분을 초로 변환
 * @param {number} minutes - 분
 * @returns {number} 초
 */
export function minutesToSeconds(minutes) {
	return minutes * 60;
}

/**
 * 초를 분으로 변환
 * @param {number} seconds - 초
 * @returns {number} 분
 */
export function secondsToMinutes(seconds) {
	return Math.floor(seconds / 60);
}