import confetti from 'canvas-confetti';

/**
 * 기본 confetti 효과
 */
export function celebrate() {
	confetti({
		particleCount: 100,
		spread: 70,
		origin: { y: 0.6 }
	});
}

/**
 * 회원가입/로그인 성공 시 사용할 confetti 효과
 */
export function celebrateSuccess() {
	// 첫 번째 폭죽
	confetti({
		particleCount: 50,
		spread: 60,
		origin: { x: 0.25, y: 0.7 },
		colors: ['#FFB6C1', '#FFE4E1', '#F0E68C', '#E6E6FA', '#98FB98']
	});

	// 두 번째 폭죽 (약간의 지연)
	setTimeout(() => {
		confetti({
			particleCount: 50,
			spread: 60,
			origin: { x: 0.75, y: 0.7 },
			colors: ['#FFB6C1', '#FFE4E1', '#F0E68C', '#E6E6FA', '#98FB98']
		});
	}, 200);
}

/**
 * 할일 완료 시 사용할 작은 confetti 효과
 */
export function celebrateTask() {
	confetti({
		particleCount: 30,
		spread: 45,
		origin: { y: 0.8 },
		colors: ['#FFB6C1', '#FFE4E1', '#F0E68C']
	});
}
