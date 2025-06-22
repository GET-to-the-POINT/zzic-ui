<script>
	import { onMount, onDestroy } from 'svelte';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import Timer from '@lucide/svelte/icons/timer';
	import Clock from '@lucide/svelte/icons/clock';
	import Target from '@lucide/svelte/icons/target';
	import CheckCircle from '@lucide/svelte/icons/check-circle';
	import Circle from '@lucide/svelte/icons/circle';
	import Volume2 from '@lucide/svelte/icons/volume-2';
	import VolumeX from '@lucide/svelte/icons/volume-x';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Settings from '@lucide/svelte/icons/settings';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';

	// 투두 리스트 데이터
	let { data } = $props();

	/** @type {import('$lib/zzic-api/todo.js').TodoResponse[]} */
	let todos = $derived(data.todoPage.content);
	let categories = $derived(data.categoryPage.content);
	let tags = $derived(data.tagPage.content);

	// 필터 업데이트 함수
	function updateFilters(event) {
		form.requestSubmit();
	}

	/** @type {import('$lib/zzic-api/todo.js').TodoResponse | null} */
	let selectedTodo = $state(null);

	// 타이머 상태
	let currentTime = $state(25 * 60); // 25분 (초 단위)
	let initialTime = $state(25 * 60);
	let isRunning = $state(false);
	let timerMode = $state('focus'); // 'focus', 'break'
	let completedSessions = $state(0);

	// 세션 데이터
	/** @type {Array<{id: string, type: string, duration: number, completedAt: string, todoId?: number, todoTitle?: string}>} */
	let sessions = $state([]);

	// 설정
	let settings = $state({
		focusTime: 25,
		breakTime: 5,
		notifications: true,
		sound: true,
		volume: 50
	});

	/** @type {NodeJS.Timeout | null} */
	let intervalId = null;
	let isCompleting = $state(false);
	let showAdvancedSettings = $state(false);
	let inputMinutes = $state(25);
	let inputSeconds = $state(0);
	let isEditingInput = $state(false);

	// 타이머 시간 설정 (완전히 새로 시작할 때만)
	$effect(() => {
		const duration = timerMode === 'focus' ? settings.focusTime * 60 : settings.breakTime * 60;
		if (!isRunning && currentTime === 0) {
			// 타이머가 완료되어 0이 된 경우에만 새로운 시간으로 설정
			currentTime = duration;
			initialTime = duration;
			// 인풋 값도 동기화
			inputMinutes = Math.floor(duration / 60);
			inputSeconds = duration % 60;
		}
	});

	// 타이머 실행 중이거나 편집 중이 아닐 때만 input 값을 현재 시간으로 업데이트
	$effect(() => {
		if (!isEditingInput) {
			inputMinutes = Math.floor(currentTime / 60);
			inputSeconds = currentTime % 60;
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
	async function handleSessionComplete() {
		isRunning = false;

		const newSession = {
			id: Date.now().toString(),
			type: timerMode,
			duration: initialTime,
			completedAt: new Date().toISOString(),
			todoId: selectedTodo?.id,
			todoTitle: selectedTodo?.title
		};

		sessions = [newSession, ...sessions];

		if (timerMode === 'focus' && selectedTodo) {
			// 선택된 투두 완료 처리
			await completeTodo(selectedTodo.id);
			showNotification(`"${selectedTodo.title}" 완료! 🎉 휴식 시간을 가져보세요.`);

			// 투두 리스트에서 완료된 투두 제거
			todos = todos.filter((/** @type {any} */ todo) => todo.id !== selectedTodo.id);
			selectedTodo = null;

			// 휴식 모드로 전환
			timerMode = 'break';
			completedSessions = completedSessions + 1;
		} else if (timerMode === 'break') {
			showNotification('휴식 시간 완료! 💪 집중할 준비가 되셨나요?');
			timerMode = 'focus';
		}

		// 사운드 재생
		if (settings.sound) {
			playNotificationSound();
		}
	}

	// 투두 완료 처리
	/**
	 * @param {number} todoId
	 */
	async function completeTodo(todoId) {
		isCompleting = true;
		try {
			const response = await fetch(`/api/todos/${todoId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					status: 'COMPLETED'
				})
			});

			if (!response.ok) {
				throw new Error('Failed to complete todo');
			}
		} catch (error) {
			console.error('Error completing todo:', error);
			showNotification('투두 완료 처리 중 오류가 발생했습니다.');
		} finally {
			isCompleting = false;
		}
	}

	// 투두 선택
	/**
	 * @param {import('$lib/zzic-api/todo.js').TodoResponse} todo
	 */
	function selectTodo(todo) {
		if (isRunning) return; // 타이머 실행 중일 때는 선택 변경 불가
		selectedTodo = todo;
		timerMode = 'focus'; // 투두 선택 시 집중 모드로 설정
	}

	/** @type {HTMLFormElement} */
	let form;

	/**
	 * 알림 표시
	 * @param {string} message 알림 메시지
	 */
	function showNotification(message) {
		if (settings.notifications && 'Notification' in window) {
			if (Notification.permission === 'granted') {
				new Notification('ZZIC 타이머', { body: message });
			} else if (Notification.permission !== 'denied') {
				Notification.requestPermission().then((permission) => {
					if (permission === 'granted') {
						new Notification('ZZIC 타이머', { body: message });
					}
				});
			}
		}
	}

	function playNotificationSound() {
		try {
			// @ts-ignore
			const AudioContextClass = window.AudioContext || window.webkitAudioContext;
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
			gainNode.gain.value = (settings.volume / 100) * 0.3;

			oscillator.start();
			oscillator.stop(audioContext.currentTime + 0.2);
		} catch (error) {
			console.log('Could not play notification sound:', error);
		}
	}

	function handleStart() {
		// 시작할 때 인풋 값으로 타이머 시간 설정
		updateTimeFromInput();
		isRunning = true;
		timerMode = 'focus'; // 시작하면 바로 집중 모드
	}

	function handlePause() {
		isRunning = false;
	}

	function toggleAdvancedSettings() {
		showAdvancedSettings = !showAdvancedSettings;
	}

	function updateTimeFromInput() {
		if (isRunning) return;
		const newTime = inputMinutes * 60 + inputSeconds;
		if (newTime > 0 && newTime <= 3600) {
			// 최대 1시간
			currentTime = newTime;
			initialTime = newTime;
		} else {
			// 유효하지 않은 값일 때 이전 값으로 복원
			const mins = Math.floor(currentTime / 60);
			const secs = currentTime % 60;
			inputMinutes = mins;
			inputSeconds = secs;
		}
	}

	/**
	 * 진행률 계산
	 * @returns {number} 0-1 사이의 진행률
	 */
	function getProgress() {
		return ((initialTime - currentTime) / initialTime) * 100;
	}

	/**
	 * 진행률 색상 가져오기 (타이머 실행 중일 때만 색상 적용)
	 * @param {string} mode 타이머 모드
	 * @returns {string} 색상 클래스
	 */
	function getProgressColor(mode) {
		if (!isRunning) return 'text-surface-500';

		switch (mode) {
			case 'focus':
				return 'text-primary-500';
			case 'break':
				return 'text-secondary-500';
			default:
				return 'text-surface-500';
		}
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
			case 'break':
				return '휴식';
			default:
				return mode;
		}
	}

	/**
	 * 우선순위 색상 가져오기
	 * @param {number} priority 우선순위
	 * @returns {string} 색상 클래스
	 */
	function getPriorityColor(priority) {
		switch (priority) {
			case 0:
				return 'text-success-500';
			case 1:
				return 'text-warning-500';
			case 2:
				return 'text-error-500';
			default:
				return 'text-surface-500';
		}
	}

	/**
	 * 우선순위 라벨 가져오기
	 * @param {number} priority 우선순위
	 * @returns {string} 우선순위 라벨
	 */
	function getPriorityLabel(priority) {
		switch (priority) {
			case 0:
				return '낮음';
			case 1:
				return '보통';
			case 2:
				return '높음';
			default:
				return '보통';
		}
	}

	/**
	 * 날짜 포맷팅
	 * @param {string} dateString 날짜 문자열
	 * @returns {string} 포맷된 날짜
	 */
	function formatDate(dateString) {
		if (!dateString) return '';
		const date = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		if (date.toDateString() === today.toDateString()) {
			return '오늘';
		} else if (date.toDateString() === tomorrow.toDateString()) {
			return '내일';
		} else {
			return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
		}
	}

	// 오늘 세션 계산
	const todaySessions = $derived(
		sessions.filter((session) => {
			const today = new Date().toDateString();
			return new Date(session.completedAt).toDateString() === today;
		})
	);

	const todayFocusTime = $derived(
		todaySessions.filter((s) => s.type === 'focus').reduce((total, s) => total + s.duration, 0)
	);

	onMount(() => {
		// 알림 권한 요청
		if (
			settings.notifications &&
			'Notification' in window &&
			Notification.permission === 'default'
		) {
			Notification.requestPermission();
		}
	});

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});
</script>

<main class="h-screen @container preset-filled-surface-50-950">
	<div class="h-full flex flex-col @md:flex-row">
		<!-- 투두 리스트 사이드바 -->
		<aside
			class="@md:w-80 bg-surface-100-900 border-b @md:border-b-0 @md:border-r border-surface-300-700 flex flex-col"
		>
			<!-- 헤더 -->
			<div class="p-4 border-b border-surface-300-700">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-lg font-bold flex items-center gap-2">
						<Target size={20} />
						할 일 목록
					</h2>
				</div>

				<!-- 필터 섹션 -->
				<form bind:this={form} class="space-y-3" oninput={updateFilters} onreset={updateFilters}>
					<!-- 카테고리 필터 -->
					<fieldset>
						<legend class="text-sm font-medium mb-2 flex w-full justify-between">
							<span>카테고리</span>
							<button
								type="reset"
								class="hover:preset-tonal-surface p-1 rounded"
								aria-label="카테고리 필터 초기화"
							>
								<RotateCcw size={14} />
							</button>
						</legend>
						<div class="flex flex-wrap gap-1">
							{#each categories as category (category.id)}
								<label
									class="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full transition-colors cursor-pointer preset-filled-surface-200-800 hover:preset-tonal-surface has-[:checked]:preset-tonal-primary"
								>
									<input type="radio" name="categoryId" class="sr-only" value={category.id} />
									{category.name}
								</label>
							{/each}
						</div>
					</fieldset>

					<!-- 태그 필터 -->
					<fieldset>
						<legend class="text-sm font-medium mb-2 flex w-full justify-between">
							<span>태그</span>
							<button
								type="reset"
								class="hover:preset-tonal-surface p-1 rounded"
								aria-label="태그 필터 초기화"
							>
								<RotateCcw size={14} />
							</button>
						</legend>
						<div
							class="flex flex-wrap gap-1 max-h-16 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-400-600 scrollbar-track-surface-200-800"
						>
							{#each tags as tag (tag)}
								<label
									class="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full transition-colors cursor-pointer preset-filled-surface-200-800 hover:preset-tonal-surface has-[:checked]:preset-tonal-secondary"
								>
									<input type="checkbox" name="tags" value={tag} class="sr-only" />
									{tag}
								</label>
							{/each}
						</div>
					</fieldset>
				</form>
			</div>

			<!-- 투두 목록 -->
			<div class="flex-1 overflow-y-auto">
				{#if todos.length === 0}
					<div class="text-center py-8 px-4 opacity-60 space-y-2">
						<CheckCircle size={48} class="mx-auto opacity-30" />
						{#if filterCategoryId || filterTags.length > 0}
							<p>필터에 맞는 투두가 없습니다!</p>
							<button
								type="button"
								class="text-sm preset-tonal-primary px-3 py-1 rounded-full"
								onclick={clearFilters}
							>
								필터 초기화
							</button>
						{:else}
							<p>완료할 투두가 없습니다!</p>
							<p class="text-sm">새로운 투두를 추가해보세요.</p>
						{/if}
					</div>
				{:else}
					<div class="space-y-1 p-2">
						{#each todos as todo (todo.id)}
							<button
								class="w-full p-3 rounded-lg border border-surface-300-700 hover:preset-tonal-primary transition-colors {selectedTodo?.id ===
								todo.id
									? 'preset-tonal-primary'
									: 'preset-filled-surface-100-900'} {isRunning && selectedTodo?.id !== todo.id
									? 'opacity-50 cursor-not-allowed'
									: ''}"
								onclick={() => selectTodo(todo)}
								disabled={isRunning && selectedTodo?.id !== todo.id}
							>
								<div class="grid grid-cols-[auto_1fr] gap-3 items-start text-left">
									<Circle size={16} class="mt-0.5 opacity-60" />
									<div class="space-y-1">
										<h4 class="font-medium text-sm leading-tight">{todo.title}</h4>
										{#if todo.description}
											<p
												class="text-xs opacity-60 overflow-hidden text-ellipsis [-webkit-line-clamp:2] [-webkit-box-orient:vertical] [display:-webkit-box]"
											>
												{todo.description}
											</p>
										{/if}
										<div class="flex flex-wrap gap-1 items-center text-xs opacity-60">
											{#if todo.priorityId !== undefined}
												<span
													class="text-xs px-2 py-1 rounded-full {getPriorityColor(todo.priorityId)}"
												>
													{getPriorityLabel(todo.priorityId)}
												</span>
											{/if}
											{#if todo.dueDate}
												<div class="flex items-center gap-1">
													<Calendar size={12} />
													<span>{formatDate(todo.dueDate)}</span>
												</div>
											{/if}
											{#if todo.categoryName}
												<span class="text-xs px-2 py-1 rounded-full preset-tonal-secondary">
													{todo.categoryName}
												</span>
											{/if}
										</div>
									</div>
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</aside>

		<!-- 메인 타이머 영역 -->
		<div class="flex-1 flex flex-col overflow-hidden">
			<!-- 헤더 -->
			<header class="p-4 border-b border-surface-300-700 bg-surface-100-900">
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 rounded-lg preset-tonal-surface grid place-items-center">
						<Timer size={24} />
					</div>
					<div class="flex-1">
						<h1 class="text-xl font-bold">집중 타이머</h1>
						<p class="text-sm opacity-60">투두를 선택하고 집중 타이머로 완료해보세요</p>
					</div>
				</div>
			</header>

			<!-- 메인 콘텐츠 -->
			<div class="flex-1 overflow-y-auto p-6 space-y-6">
				<!-- 선택된 투두 정보 -->
				{#if selectedTodo}
					<div class="card preset-tonal-primary p-4">
						<div class="grid grid-cols-[auto_1fr] gap-3 items-start">
							<Target size={20} class="mt-0.5" />
							<div>
								<h3 class="font-medium">{selectedTodo.title}</h3>
								{#if selectedTodo.description}
									<p class="text-sm opacity-80 mt-1">{selectedTodo.description}</p>
								{/if}
								<div class="flex flex-wrap gap-2 items-center text-sm opacity-80 mt-2">
									{#if selectedTodo.priorityId !== undefined}
										<span class="text-xs px-2 py-1 rounded-full">
											{getPriorityLabel(selectedTodo.priorityId)}
										</span>
									{/if}
									{#if selectedTodo.dueDate}
										<div class="flex items-center gap-1">
											<Calendar size={12} />
											<span>{formatDate(selectedTodo.dueDate)}</span>
										</div>
									{/if}
									{#if selectedTodo.categoryName}
										<span class="text-xs px-2 py-1 rounded-full">
											{selectedTodo.categoryName}
										</span>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- 타이머 -->
				<div class="card preset-tonal-surface p-8">
					<div class="text-center space-y-6">
						<!-- 타이머 디스플레이 -->
						<div class="relative">
							<div
								class="w-64 h-64 mx-auto relative {isRunning
									? timerMode === 'focus'
										? 'bg-primary-500/10'
										: 'bg-secondary-500/10'
									: ''} rounded-full"
							>
								<svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
									<circle
										cx="50"
										cy="50"
										r="45"
										stroke="currentColor"
										stroke-width="2"
										fill="none"
										class="text-surface-200-800"
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
										class={getProgressColor(timerMode)}
										stroke-linecap="round"
									/>
								</svg>
								<div class="absolute inset-0 grid place-items-center">
									<div class="text-center">
										<input
											type="number"
											bind:value={inputMinutes}
											onfocus={() => (isEditingInput = true)}
											onblur={() => {
												isEditingInput = false;
												updateTimeFromInput();
											}}
											min="0"
											max="59"
											disabled={isRunning}
											class="text-right text-4xl font-mono font-bold w-24 bg-transparent border-none focus:ring-2 focus:ring-transparent disabled:opacity-75 disabled:cursor-not-allowed [-webkit-appearance:none] [-moz-appearance:textfield] [appearance:none] [&::-webkit-outer-spin-button]:[-webkit-appearance:none] [&::-webkit-outer-spin-button]:[margin:0] [&::-webkit-inner-spin-button]:[-webkit-appearance:none] [&::-webkit-inner-spin-button]:[margin:0]"
										/>
										<span
											class="text-4xl font-mono font-bold {isRunning
												? 'animate-[blink_2s_step-end_infinite]'
												: ''}">:</span
										>
										<input
											type="number"
											bind:value={inputSeconds}
											onfocus={() => (isEditingInput = true)}
											onblur={() => {
												isEditingInput = false;
												updateTimeFromInput();
											}}
											min="0"
											max="59"
											disabled={isRunning}
											class="text-left text-4xl font-mono font-bold w-24 bg-transparent border-none focus:ring-2 focus:ring-transparent disabled:opacity-75 disabled:cursor-not-allowed [-webkit-appearance:none] [-moz-appearance:textfield] [appearance:none] [&::-webkit-outer-spin-button]:[-webkit-appearance:none] [&::-webkit-outer-spin-button]:[margin:0] [&::-webkit-inner-spin-button]:[-webkit-appearance:none] [&::-webkit-inner-spin-button]:[margin:0]"
										/>
									</div>
								</div>
							</div>
						</div>

						<!-- 컨트롤 버튼 -->
						<div class="max-w-xs mx-auto">
							{#if !isRunning}
								<button class="btn preset-tonal-primary w-full" onclick={handleStart}>
									<Play size={16} />
									시작
								</button>
							{:else}
								<button class="btn preset-outlined-primary-500 w-full" onclick={handlePause}>
									<Pause size={16} />
									일시정지
								</button>
							{/if}
						</div>

						<!-- 상세 설정 토글 버튼 -->
						<div class="text-center">
							<button
								class="btn preset-outlined-surface-500 text-sm px-4 py-2"
								onclick={toggleAdvancedSettings}
							>
								<Settings size={16} />
								{showAdvancedSettings ? '설정 숨기기' : '상세 설정'}
							</button>
						</div>
					</div>
				</div>

				<!-- 오늘 통계 (상세 설정에서만 표시) -->
				{#if showAdvancedSettings}
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div class="card preset-tonal-success p-4">
							<div class="grid grid-cols-[auto_1fr] gap-4 items-center">
								<Target size={24} />
								<div>
									<p class="text-xl font-bold">
										{todaySessions.filter((s) => s.type === 'focus').length}
									</p>
									<p class="text-xs opacity-60">완료 세션</p>
								</div>
							</div>
						</div>

						<div class="card preset-tonal-secondary p-4">
							<div class="grid grid-cols-[auto_1fr] gap-4 items-center">
								<Clock size={24} />
								<div>
									<p class="text-xl font-bold">{Math.floor(todayFocusTime / 60)}분</p>
									<p class="text-xs opacity-60">집중 시간</p>
								</div>
							</div>
						</div>

						<div class="card preset-tonal-primary p-4">
							<div class="grid grid-cols-[auto_1fr] gap-4 items-center">
								<CheckCircle size={24} />
								<div>
									<p class="text-xl font-bold">{completedSessions}</p>
									<p class="text-xs opacity-60">연속 완료</p>
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- 설정 (상세 설정에서만 표시) -->
				{#if showAdvancedSettings}
					<div class="card preset-tonal-surface p-4">
						<h3 class="h5 mb-4">타이머 설정</h3>
						<p class="text-sm opacity-60 mb-4">
							시간을 변경하려면 타이머 숫자를 클릭하거나 아래 설정을 수정하세요
						</p>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<label class="label">
								<span class="label-text">집중 시간 (분)</span>
								<input
									class="input"
									type="number"
									bind:value={settings.focusTime}
									min="1"
									max="60"
									disabled={isRunning}
								/>
							</label>

							<label class="label">
								<span class="label-text">휴식 시간 (분)</span>
								<input
									class="input"
									type="number"
									bind:value={settings.breakTime}
									min="1"
									max="30"
									disabled={isRunning}
								/>
							</label>

							<label class="grid grid-cols-[1fr_auto] gap-4 items-center">
								<div>
									<div class="font-medium">브라우저 알림</div>
									<p class="text-sm opacity-60">세션 완료 시 브라우저 알림</p>
								</div>
								<input type="checkbox" class="checkbox" bind:checked={settings.notifications} />
							</label>

							<label class="grid grid-cols-[1fr_auto] gap-4 items-center">
								<div>
									<div class="font-medium">사운드 알림</div>
									<p class="text-sm opacity-60">세션 완료 시 사운드 재생</p>
								</div>
								<input type="checkbox" class="checkbox" bind:checked={settings.sound} />
							</label>

							{#if settings.sound}
								<div class="md:col-span-2">
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
							{/if}
						</div>
					</div>
				{/if}

				<!-- 최근 세션 (상세 설정에서만 표시) -->
				{#if showAdvancedSettings && sessions.length > 0}
					<div class="card preset-tonal-surface p-4">
						<h3 class="h5 mb-4">최근 세션</h3>
						<div class="space-y-2">
							{#each sessions.slice(0, 5) as session (session.id)}
								<div
									class="card preset-filled-surface-100-900 p-3 grid grid-cols-[auto_1fr_auto] gap-4 items-center"
								>
									<div
										class="w-3 h-3 rounded-full {session.type === 'focus'
											? 'bg-primary-500'
											: 'bg-success-500'}"
									></div>
									<div>
										<div class="font-medium text-sm">
											{getModeLabel(session.type)}
											{#if session.todoTitle}
												- {session.todoTitle}
											{/if}
										</div>
										<div class="text-xs opacity-60">
											{Math.floor(session.duration / 60)}분
										</div>
									</div>
									<span class="text-xs opacity-60">
										{new Date(session.completedAt).toLocaleTimeString('ko-KR', {
											hour: '2-digit',
											minute: '2-digit'
										})}
									</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</main>
