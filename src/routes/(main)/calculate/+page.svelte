<script>
	import Calculator from '@lucide/svelte/icons/calculator';

	// 계산기 상태
	let display = $state('0');
	let previousValue = $state(null);
	let operation = $state(null);
	let waitingForOperand = $state(false);

	// 화면에 표시될 값
	const displayValue = $derived(display || '0');

	// 숫자 입력 처리
	function inputNumber(num) {
		if (waitingForOperand) {
			display = String(num);
			waitingForOperand = false;
		} else {
			display = display === '0' ? String(num) : display + num;
		}
	}

	// 소수점 입력 처리
	function inputDecimal() {
		if (waitingForOperand) {
			display = '0.';
			waitingForOperand = false;
		} else if (display.indexOf('.') === -1) {
			display = display + '.';
		}
	}

	// 연산자 입력 처리
	function inputOperation(nextOperation) {
		const inputValue = parseFloat(display);

		if (previousValue === null) {
			previousValue = inputValue;
		} else if (operation) {
			const currentValue = previousValue || 0;
			const newValue = calculate(currentValue, inputValue, operation);

			display = String(newValue);
			previousValue = newValue;
		}

		waitingForOperand = true;
		operation = nextOperation;
	}

	// 계산 실행
	function calculate(firstOperand, secondOperand, operation) {
		switch (operation) {
			case '+':
				return firstOperand + secondOperand;
			case '-':
				return firstOperand - secondOperand;
			case '*':
				return firstOperand * secondOperand;
			case '/':
				return secondOperand !== 0 ? firstOperand / secondOperand : 0;
			case '%':
				return firstOperand % secondOperand;
			default:
				return secondOperand;
		}
	}

	// 계산 결과 출력
	function performCalculation() {
		const inputValue = parseFloat(display);

		if (previousValue !== null && operation) {
			const newValue = calculate(previousValue, inputValue, operation);
			display = String(newValue);
			previousValue = null;
			operation = null;
			waitingForOperand = true;
		}
	}

	// 전체 클리어
	function clearAll() {
		display = '0';
		previousValue = null;
		operation = null;
		waitingForOperand = false;
	}

	// 부호 변경
	function toggleSign() {
		if (display !== '0') {
			display = display.charAt(0) === '-' ? display.slice(1) : '-' + display;
		}
	}

	// 퍼센트 계산
	function inputPercent() {
		const value = parseFloat(display);
		if (value !== 0) {
			display = String(value / 100);
		}
	}
</script>

<svelte:head>
	<title>계산기 - ZZIC</title>
</svelte:head>

<main class="p-4">
	<div class="space-y-4">
		<!-- 헤더 -->
		<div class="flex items-center gap-3 mb-6">
			<Calculator size={24} class="text-primary-500" />
			<h1 class="text-2xl font-bold text-surface-900-50">계산기</h1>
		</div>

		<!-- 계산기 본체 -->
		<div class="card preset-filled-surface-800-200 p-4 shadow-xl">
			<!-- 디스플레이 -->
			<div class="preset-filled-surface-50-950 p-4 rounded-lg mb-4">
				<div
					class="text-right text-3xl font-mono text-surface-900-50 min-h-[3rem] flex items-center justify-end overflow-hidden"
				>
					{displayValue}
				</div>
			</div>

			<!-- 버튼 그리드 -->
			<div class="grid grid-cols-4 gap-2">
				<!-- 첫 번째 줄: AC, +/-, %, ÷ -->
				<button
					class="btn preset-filled-secondary-500 h-14 text-lg font-semibold"
					onclick={clearAll}
				>
					AC
				</button>
				<button
					class="btn preset-filled-secondary-500 h-14 text-lg font-semibold"
					onclick={toggleSign}
				>
					+/-
				</button>
				<button
					class="btn preset-filled-secondary-500 h-14 text-lg font-semibold"
					onclick={inputPercent}
				>
					%
				</button>
				<button
					class="btn preset-filled-primary-500 h-14 text-lg font-semibold"
					onclick={() => inputOperation('/')}
				>
					÷
				</button>

				<!-- 두 번째 줄: 7, 8, 9, × -->
				<button
					class="btn preset-filled-surface-200-800 h-14 text-lg font-semibold"
					onclick={() => inputNumber(7)}
				>
					7
				</button>
				<button
					class="btn preset-filled-surface-200-800 h-14 text-lg font-semibold"
					onclick={() => inputNumber(8)}
				>
					8
				</button>
				<button
					class="btn preset-filled-surface-200-800 h-14 text-lg font-semibold"
					onclick={() => inputNumber(9)}
				>
					9
				</button>
				<button
					class="btn preset-filled-primary-500 h-14 text-lg font-semibold"
					onclick={() => inputOperation('*')}
				>
					×
				</button>

				<!-- 세 번째 줄: 4, 5, 6, - -->
				<button
					class="btn preset-filled-surface-200-800 h-14 text-lg font-semibold"
					onclick={() => inputNumber(4)}
				>
					4
				</button>
				<button
					class="btn preset-filled-surface-200-800 h-14 text-lg font-semibold"
					onclick={() => inputNumber(5)}
				>
					5
				</button>
				<button
					class="btn preset-filled-surface-200-800 h-14 text-lg font-semibold"
					onclick={() => inputNumber(6)}
				>
					6
				</button>
				<button
					class="btn preset-filled-primary-500 h-14 text-lg font-semibold"
					onclick={() => inputOperation('-')}
				>
					-
				</button>

				<!-- 네 번째 줄: 1, 2, 3, + -->
				<button
					class="btn preset-filled-surface-200-800 h-14 text-lg font-semibold"
					onclick={() => inputNumber(1)}
				>
					1
				</button>
				<button
					class="btn preset-filled-surface-200-800 h-14 text-lg font-semibold"
					onclick={() => inputNumber(2)}
				>
					2
				</button>
				<button
					class="btn preset-filled-surface-200-800 h-14 text-lg font-semibold"
					onclick={() => inputNumber(3)}
				>
					3
				</button>
				<button
					class="btn preset-filled-primary-500 h-14 text-lg font-semibold"
					onclick={() => inputOperation('+')}
				>
					+
				</button>

				<!-- 다섯 번째 줄: 0 (2칸), ., = -->
				<button
					class="btn preset-filled-surface-200-800 h-14 text-lg font-semibold col-span-2"
					onclick={() => inputNumber(0)}
				>
					0
				</button>
				<button
					class="btn preset-filled-surface-200-800 h-14 text-lg font-semibold"
					onclick={inputDecimal}
				>
					.
				</button>
				<button
					class="btn preset-filled-success-500 h-14 text-lg font-semibold"
					onclick={performCalculation}
				>
					=
				</button>
			</div>
		</div>

		<!-- 사용법 안내 -->
		<div class="card preset-filled-surface-800-200 p-4">
			<h3 class="text-sm font-semibold text-surface-700-300 mb-2">사용법</h3>
			<ul class="text-xs text-surface-600-400 space-y-1">
				<li>• 숫자를 입력하고 연산자를 선택하세요</li>
				<li>• AC: 전체 초기화</li>
				<li>• +/-: 부호 변경</li>
				<li>• %: 퍼센트 계산</li>
			</ul>
		</div>
	</div>
</main>
