<script>
	import { onMount, onDestroy } from 'svelte';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import Square from '@lucide/svelte/icons/square';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Timer from '@lucide/svelte/icons/timer';
	import Coffee from '@lucide/svelte/icons/coffee';
	import Brain from '@lucide/svelte/icons/brain';
	import BarChart3 from '@lucide/svelte/icons/bar-chart-3';
	import Trophy from '@lucide/svelte/icons/trophy';
	import Flame from '@lucide/svelte/icons/flame';
	import Clock from '@lucide/svelte/icons/clock';
	import Target from '@lucide/svelte/icons/target';
	import Zap from '@lucide/svelte/icons/zap';
	import Volume2 from '@lucide/svelte/icons/volume-2';
	import VolumeX from '@lucide/svelte/icons/volume-x';
	import Bell from '@lucide/svelte/icons/bell';

	// Timer modes: 'focus', 'shortBreak', 'longBreak'
	// Timer session: {id, type, duration, completedAt}
	// Timer settings: {focusTime, shortBreakTime, longBreakTime, longBreakInterval, autoStartBreaks, autoStartFocus, notifications, sound, volume}

	// 타이머 상태
	let currentTime = $state(25 * 60); // 25분 (초 단위)
	let initialTime = $state(25 * 60);
	let isRunning = $state(false);
	let currentMode = $state('focus');
	let completedSessions = $state(0);
	let activeTab = $state('timer');

	// 세션 데이터
	let sessions = $state([]);

	// 설정
	let settings = $state({
		focusTime: 25,
		shortBreakTime: 5,
		longBreakTime: 15,
		longBreakInterval: 4,
		notifications: true,
		sound: true,
		volume: 50
	});

	let intervalId = null;

	// 모드 변경 시 시간 설정
	$effect(() => {
		let duration = 0;
		switch (currentMode) {
			case 'focus':
				duration = settings.focusTime * 60;
				break;
			case 'shortBreak':
				duration = settings.shortBreakTime * 60;
				break;
			case 'longBreak':
				duration = settings.longBreakTime * 60;
				break;
			default:
				duration = settings.focusTime * 60;
		}
		if (!isRunning) {
			currentTime = duration;
			initialTime = duration;
		}
	});

	// 타이머 실행
	$effect(() => {
		if (isRunning && currentTime > 0) {
			intervalId = setInterval(() => {
				currentTime = currentTime - 1;
			}, 1000);
		} else if (currentTime === 0 && isRunning) {
			handleSessionComplete();
		} else {
			if (intervalId) {
				clearInterval(intervalId);
				intervalId = null;
			}
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	});

	// 세션 완료 처리
	function handleSessionComplete() {
		isRunning = false;
		
		const newSession = {
			id: Date.now().toString(),
			type: currentMode,
			duration: initialTime,
			completedAt: new Date().toISOString()
		};
		
		sessions = [newSession, ...sessions];
		
		if (currentMode === 'focus') {
			completedSessions = completedSessions + 1;
			
			// 장기 휴식 여부 결정
			const nextBreakType = completedSessions % settings.longBreakInterval === 0 
				? 'longBreak' 
				: 'shortBreak';
			
			showNotification(`집중 세션 완료! 🎉 ${nextBreakType === 'longBreak' ? '장기' : '단기'} 휴식을 취하세요.`);
			
			currentMode = nextBreakType;
		} else {
			showNotification('휴식 시간 완료! 💪 집중할 준비가 되셨나요?');
			currentMode = 'focus';
		}
		
		// 사운드 재생
		if (settings.sound) {
			playNotificationSound();
		}
	}

	/**
	 * 알림 표시
	 * @param {string} message 알림 메시지
	 */
	function showNotification(message) {
		if (settings.notifications && 'Notification' in window) {
			if (Notification.permission === 'granted') {
				new Notification('ZZIC 타이머', { body: message });
			} else if (Notification.permission !== 'denied') {
				Notification.requestPermission().then(permission => {
					if (permission === 'granted') {
						new Notification('ZZIC 타이머', { body: message });
					}
				});
			}
		}
	}

	function playNotificationSound() {
		try {
			// 간단한 beep 사운드 대신 Audio API 사용
			const AudioContextClass = window.AudioContext || window['webkitAudioContext'];
			if (!AudioContextClass) {
				console.warn('AudioContext not supported');
				return;
			}
			const audioContext = new AudioContextClass();
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();
			
			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);
			
			oscillator.frequency.value = 800;
			oscillator.type = 'sine';
			gainNode.gain.value = settings.volume / 100 * 0.3;
			
			oscillator.start();
			oscillator.stop(audioContext.currentTime + 0.2);
		} catch (error) {
			console.log('Could not play notification sound:', error);
		}
	}

	function handleStart() {
		isRunning = true;
	}

	function handlePause() {
		isRunning = false;
	}

	function handleStop() {
		isRunning = false;
		currentTime = initialTime;
	}

	function handleReset() {
		isRunning = false;
		currentTime = initialTime;
	}

	/**
	 * 시간 포맷팅
	 * @param {number} seconds 초 단위 시간
	 * @returns {string} MM:SS 형식 문자열
	 */
	function formatTime(seconds) {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	/**
	 * 진행률 계산
	 * @returns {number} 0-1 사이의 진행률
	 */
	function getProgress() {
		return ((initialTime - currentTime) / initialTime) * 100;
	}

	/**
	 * 모드 라벨 가져오기
	 * @param {string} mode 타이머 모드
	 * @returns {string} 모드 라벨
	 */
	function getModeLabel(mode) {
		switch (mode) {
			case 'focus':
				return '집중';
			case 'shortBreak':
				return '단기 휴식';
			case 'longBreak':
				return '장기 휴식';
			default:
				return mode;
		}
	}

	/**
	 * 모드 프리셋 가져오기
	 * @param {string} mode 타이머 모드
	 * @returns {string} 모드 프리셋 클래스
	 */
	function getModePreset(mode) {
		switch (mode) {
			case 'focus':
				return 'preset-tonal-primary';
			case 'shortBreak':
				return 'preset-tonal-success';
			case 'longBreak':
				return 'preset-tonal-secondary';
			default:
				return 'preset-tonal-surface';
		}
	}

	/**
	 * 진행률 색상 가져오기
	 * @param {string} mode 타이머 모드
	 * @returns {string} 색상 클래스
	 */
	function getProgressColor(mode) {
		switch (mode) {
			case 'focus':
				return 'text-primary-500';
			case 'shortBreak':
				return 'text-success-500';
			case 'longBreak':
				return 'text-secondary-500';
			default:
				return 'text-surface-500';
		}
	}

	// 오늘 세션 계산
	const todaySessions = $derived(sessions.filter(session => {
		const today = new Date().toDateString();
		return new Date(session.completedAt).toDateString() === today;
	}));

	const todayFocusTime = $derived(todaySessions
		.filter(s => s.type === 'focus')
		.reduce((total, s) => total + s.duration, 0));

	onMount(() => {
		// 알림 권한 요청
		if (settings.notifications && 'Notification' in window && Notification.permission === 'default') {
			Notification.requestPermission();
		}
	});

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});
</script>

<main class="min-h-screen">
	<div class="max-w-6xl mx-auto px-6 py-8">
		<!-- 헤더 -->
		<div class="mb-8 space-y-4">
			<div class="grid grid-cols-[auto_1fr] gap-4 items-center">
				<div class="w-12 h-12 rounded-lg preset-tonal-primary grid place-items-center">
					<Timer size={24} />
				</div>
				<div>
					<h1 class="h1">집중 타이머</h1>
					<p class="opacity-60">포모도로 기법으로 생산성을 높여보세요</p>
				</div>
			</div>
		</div>

		<!-- 탭 헤더 -->
		<div class="mb-6">
			<div class="grid grid-cols-3 gap-2 max-w-md">
				<button 
					class="chip {activeTab === 'timer' ? 'preset-tonal-primary' : 'preset-outlined-surface-500'}"
					onclick={() => activeTab = 'timer'}
				>
					타이머
				</button>
				<button 
					class="chip {activeTab === 'stats' ? 'preset-tonal-primary' : 'preset-outlined-surface-500'}"
					onclick={() => activeTab = 'stats'}
				>
					통계
				</button>
				<button 
					class="chip {activeTab === 'settings' ? 'preset-tonal-primary' : 'preset-outlined-surface-500'}"
					onclick={() => activeTab = 'settings'}
				>
					설정
				</button>
			</div>
		</div>

		{#if activeTab === 'timer'}
			<!-- 타이머 탭 -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<!-- 메인 타이머 -->
				<div class="lg:col-span-2">
					<div class="card preset-tonal-surface p-8">
						<div class="text-center space-y-6">
							<!-- 모드 선택 -->
							<div class="grid grid-cols-3 gap-2 max-w-md mx-auto">
								{#each ['focus', 'shortBreak', 'longBreak'] as mode}
									<button
										class="chip {currentMode === mode ? getModePreset(mode) : 'preset-outlined-surface-500'}"
										onclick={() => !isRunning && (currentMode = mode)}
										disabled={isRunning}
									>
										{getModeLabel(mode)}
									</button>
								{/each}
							</div>

							<!-- 타이머 디스플레이 -->
							<div class="relative">
								<div class="w-64 h-64 mx-auto relative">
									<svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
										<circle
											cx="50"
											cy="50"
											r="45"
											stroke="currentColor"
											stroke-width="2"
											fill="none"
											class="text-surface-200"
										/>
										<circle
											cx="50"
											cy="50"
											r="45"
											stroke="currentColor"
											stroke-width="2"
											fill="none"
											stroke-dasharray={2 * Math.PI * 45}
											stroke-dashoffset={2 * Math.PI * 45 * (1 - getProgress() / 100)}
											class={getProgressColor(currentMode)}
											stroke-linecap="round"
										/>
									</svg>
									<div class="absolute inset-0 grid place-items-center">
										<span class="text-4xl font-mono font-bold">
											{formatTime(currentTime)}
										</span>
									</div>
								</div>
							</div>

							<!-- 컨트롤 버튼 -->
							<div class="grid grid-cols-4 gap-2 max-w-md mx-auto">
								{#if !isRunning}
									<button
										class="btn preset-tonal-primary"
										onclick={handleStart}
									>
										<Play size={16} />
										시작
									</button>
								{:else}
									<button
										class="btn preset-outlined-primary-500"
										onclick={handlePause}
									>
										<Pause size={16} />
										일시정지
									</button>
								{/if}
								
								<button
									class="btn preset-outlined-surface-500"
									onclick={handleStop}
								>
									<Square size={16} />
									정지
								</button>
								
								<button
									class="btn preset-outlined-surface-500"
									onclick={handleReset}
								>
									<RotateCcw size={16} />
									초기화
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- 사이드 패널 -->
				<div class="space-y-4">
					<!-- 오늘 통계 -->
					<div class="card preset-tonal-surface p-4">
						<div class="grid grid-cols-[auto_1fr] gap-2 items-center mb-4">
							<BarChart3 size={20} />
							<h3 class="h5">오늘 통계</h3>
						</div>
						<div class="space-y-2">
							<div class="grid grid-cols-[1fr_auto] gap-2 items-center">
								<span class="text-sm opacity-60">완료 세션</span>
								<div class="grid grid-cols-[auto_auto] gap-1 items-center">
									<Target size={16} class="text-success-500" />
									<span class="font-medium">{todaySessions.filter(s => s.type === 'focus').length}개</span>
								</div>
							</div>
							
							<div class="grid grid-cols-[1fr_auto] gap-2 items-center">
								<span class="text-sm opacity-60">집중 시간</span>
								<div class="grid grid-cols-[auto_auto] gap-1 items-center">
									<Clock size={16} class="text-secondary-500" />
									<span class="font-medium">{Math.floor(todayFocusTime / 60)}분</span>
								</div>
							</div>
							
							<div class="grid grid-cols-[1fr_auto] gap-2 items-center">
								<span class="text-sm opacity-60">연속 완료</span>
								<div class="grid grid-cols-[auto_auto] gap-1 items-center">
									<Flame size={16} class="text-warning-500" />
									<span class="font-medium">{completedSessions}회</span>
								</div>
							</div>
						</div>
					</div>

					<!-- 빠른 설정 -->
					<div class="card preset-tonal-surface p-4">
						<div class="grid grid-cols-[auto_1fr] gap-2 items-center mb-4">
							<Zap size={20} />
							<h3 class="h5">빠른 설정</h3>
						</div>
						<div class="space-y-2">
							<label class="grid grid-cols-[1fr_auto] gap-2 items-center">
								<span class="text-sm">알림</span>
								<input
									type="checkbox"
									class="checkbox"
									bind:checked={settings.notifications}
								/>
							</label>
							
							<label class="grid grid-cols-[1fr_auto] gap-2 items-center">
								<span class="text-sm">사운드</span>
								<input
									type="checkbox"
									class="checkbox"
									bind:checked={settings.sound}
								/>
							</label>
						</div>
					</div>
				</div>
			</div>

		{:else if activeTab === 'stats'}
			<!-- 통계 탭 -->
			<div class="space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<div class="card preset-tonal-success p-4">
						<div class="grid grid-cols-[auto_1fr] gap-4 items-center">
							<Target size={32} />
							<div>
								<p class="text-2xl font-bold">{sessions.filter(s => s.type === 'focus').length}</p>
								<p class="text-sm opacity-60">총 집중 세션</p>
							</div>
						</div>
					</div>

					<div class="card preset-tonal-secondary p-4">
						<div class="grid grid-cols-[auto_1fr] gap-4 items-center">
							<Clock size={32} />
							<div>
								<p class="text-2xl font-bold">
									{Math.floor(sessions.filter(s => s.type === 'focus').reduce((t, s) => t + s.duration, 0) / 3600)}h
								</p>
								<p class="text-sm opacity-60">총 집중 시간</p>
							</div>
						</div>
					</div>

					<div class="card preset-tonal-warning p-4">
						<div class="grid grid-cols-[auto_1fr] gap-4 items-center">
							<Flame size={32} />
							<div>
								<p class="text-2xl font-bold">{completedSessions}</p>
								<p class="text-sm opacity-60">연속 완료</p>
							</div>
						</div>
					</div>

					<div class="card preset-tonal-primary p-4">
						<div class="grid grid-cols-[auto_1fr] gap-4 items-center">
							<Trophy size={32} />
							<div>
								<p class="text-2xl font-bold">{todaySessions.length}</p>
								<p class="text-sm opacity-60">오늘 세션</p>
							</div>
						</div>
					</div>
				</div>

				<!-- 최근 세션 목록 -->
				<div class="card preset-tonal-surface p-4">
					<h3 class="h5 mb-4">최근 세션</h3>
					{#if sessions.length === 0}
						<div class="text-center py-8 opacity-60">
							아직 완료된 세션이 없습니다.
						</div>
					{:else}
						<div class="space-y-2">
							{#each sessions.slice(0, 10) as session (session.id)}
								<div class="card preset-filled-surface-100-900 p-4 grid grid-cols-[auto_1fr_auto] gap-4 items-center">
									<div class="w-3 h-3 rounded-full {
										session.type === 'focus' ? 'bg-primary-500' :
										session.type === 'shortBreak' ? 'bg-success-500' :
										'bg-secondary-500'
									}"></div>
									<div>
										<span class="font-medium">{getModeLabel(session.type)}</span>
										<span class="text-sm opacity-60 ml-2">
											{Math.floor(session.duration / 60)}분
										</span>
									</div>
									<span class="text-sm opacity-60">
										{new Date(session.completedAt).toLocaleTimeString('ko-KR', {
											hour: '2-digit',
											minute: '2-digit'
										})}
									</span>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>

		{:else if activeTab === 'settings'}
			<!-- 설정 탭 -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div class="card preset-tonal-surface p-4">
					<h3 class="h5 mb-4">타이머 설정</h3>
					<div class="space-y-4">
						<label class="label">
							<span class="label-text">집중 시간 (분)</span>
							<input
								class="input"
								type="number"
								bind:value={settings.focusTime}
								min="1"
								max="60"
							/>
						</label>

						<label class="label">
							<span class="label-text">단기 휴식 (분)</span>
							<input
								class="input"
								type="number"
								bind:value={settings.shortBreakTime}
								min="1"
								max="30"
							/>
						</label>

						<label class="label">
							<span class="label-text">장기 휴식 (분)</span>
							<input
								class="input"
								type="number"
								bind:value={settings.longBreakTime}
								min="1"
								max="60"
							/>
						</label>

						<label class="label">
							<span class="label-text">장기 휴식 간격 (세션)</span>
							<input
								class="input"
								type="number"
								bind:value={settings.longBreakInterval}
								min="2"
								max="10"
							/>
						</label>
					</div>
				</div>

				<div class="card preset-tonal-surface p-4">
					<h3 class="h5 mb-4">알림 및 자동화</h3>
					<div class="space-y-4">
						<label class="grid grid-cols-[1fr_auto] gap-4 items-center">
							<div>
								<div class="font-medium">브라우저 알림</div>
								<p class="text-sm opacity-60">세션 완료 시 브라우저 알림</p>
							</div>
							<input
								type="checkbox"
								class="checkbox"
								bind:checked={settings.notifications}
							/>
						</label>

						<label class="grid grid-cols-[1fr_auto] gap-4 items-center">
							<div>
								<div class="font-medium">사운드 알림</div>
								<p class="text-sm opacity-60">세션 완료 시 사운드 재생</p>
							</div>
							<input
								type="checkbox"
								class="checkbox"
								bind:checked={settings.sound}
							/>
						</label>

						<div class="space-y-2">
							<label class="label">
								<span class="label-text">볼륨</span>
								<div class="grid grid-cols-[auto_1fr_auto_auto] gap-2 items-center">
									<VolumeX size={16} class="opacity-60" />
									<input
										type="range"
										class="input"
										bind:value={settings.volume}
										min="0"
										max="100"
										step="10"
									/>
									<Volume2 size={16} class="opacity-60" />
									<span class="text-sm opacity-60 w-12">{settings.volume}%</span>
								</div>
							</label>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</main>
