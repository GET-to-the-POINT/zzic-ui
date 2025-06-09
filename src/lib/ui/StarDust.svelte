<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// === Props ===
	/**
	 * @typedef {Object} Props
	 * @property {number} [count=25] - 파티클 개수
	 * @property {number} [speed=1] - 떨어지는 속도 배율
	 */
	
	/** @type {Props} */
	const { 
		count = 25,
		speed = 1
	} = $props();

	// === 상태 변수 ===
	let particles = $state([]);
	let animationId = $state(null);
	let containerRef = $state();

	// === 파티클 생성 함수 ===
	function createParticle(id) {
		return {
			id,
			x: Math.random() * 100, // 화면 너비 전체에 걸쳐 랜덤 생성
			y: -10, // 화면 위쪽에서 시작
			size: Math.random() * 1.2 + 0.8, // 0.8rem ~ 2.0rem (더 큰 별)
			speed: (Math.random() * 1.0 + 0.3) * speed, // 0.3 ~ 1.3 배율 (더 느리게)
			baseSpeed: (Math.random() * 1.0 + 0.3) * speed, // 기본 속도 저장
			rotation: Math.random() * 360,
			rotationSpeed: (Math.random() - 0.5) * 2, // -1 ~ 1도/프레임 (더 부드럽게)
			swayAmplitude: Math.random() * 3 + 2, // 2 ~ 5px 좌우 흔들림 (더 크게)
			swaySpeed: Math.random() * 0.015 + 0.005, // 흔들림 속도 (더 느리게)
			swaySpeed2: Math.random() * 0.008 + 0.003, // 두 번째 사인파 주파수
			opacity: Math.random() * 0.3 + 0.7, // 0.7 ~ 1.0 투명도
			initialX: 0, // 초기 X 좌표 저장용
			time: Math.random() * 1000, // 각 파티클마다 다른 시작 시간
			// 충돌 관련
			velocityX: 0, // X축 속도
			velocityY: 0, // Y축 속도
			collided: false // 충돌 상태
		};
	}

	// === 파티클 초기화 ===
	function initParticles() {
		particles = Array.from({ length: count }, (_, i) => {
			const particle = createParticle(i);
			particle.initialX = particle.x;
			return particle;
		});
	}

	// === 하트와의 충돌 감지 함수 ===
	function checkHeartCollision(particle) {
		// 하트 영역: 화면 중앙 30% x 40% 영역
		const heartLeft = 35;
		const heartRight = 65;
		const heartTop = 35;
		const heartBottom = 65;
		
		return (
			particle.x >= heartLeft && 
			particle.x <= heartRight && 
			particle.y >= heartTop && 
			particle.y <= heartBottom
		);
	}

	// === 충돌 시 파티클 반응 함수 ===
	function handleCollision(particle) {
		if (!particle.collided) {
			// 처음 충돌 시에만 속도 변경
			particle.collided = true;
			
			// 하트 중심에서 멀어지는 방향으로 튕겨나가기
			const heartCenterX = 50;
			const heartCenterY = 50;
			const directionX = particle.x - heartCenterX;
			const directionY = particle.y - heartCenterY;
			
			// 정규화 및 튕김 효과
			const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
			if (magnitude > 0) {
				particle.velocityX = (directionX / magnitude) * 2; // 튕김 강도
				particle.velocityY = (directionY / magnitude) * 1; // Y축은 덜 튕기게
			}
			
			// 회전 속도도 증가
			particle.rotationSpeed *= 1.5;
		}
	}

	// === 애니메이션 업데이트 ===
	function updateParticles() {
		particles = particles.map(particle => {
			// 시간 업데이트
			particle.time += 1;
			
			// 하트와의 충돌 감지
			if (checkHeartCollision(particle)) {
				handleCollision(particle);
			} else {
				// 충돌 영역을 벗어나면 충돌 상태 리셋
				particle.collided = false;
			}
			
			// 기본 낙하 속도 (나뭇잎처럼 미세한 변화)
			const speedVariation = Math.sin(particle.time * 0.01) * 0.1; // 속도 변화
			particle.speed = particle.baseSpeed + speedVariation;
			
			// Y축 이동 (떨어지기 + 충돌 후 속도)
			particle.y += particle.speed + particle.velocityY;
			
			// 복잡한 좌우 흔들림 (여러 주파수 조합)
			const sway1 = Math.sin(particle.time * particle.swaySpeed) * particle.swayAmplitude;
			const sway2 = Math.sin(particle.time * particle.swaySpeed2) * (particle.swayAmplitude * 0.3);
			const naturalSway = sway1 + sway2;
			
			// X축 이동 (자연스러운 흔들림 + 충돌 후 속도)
			particle.x = particle.initialX + naturalSway + particle.velocityX;
			
			// 속도 감쇠 (공기 저항 시뮬레이션)
			particle.velocityX *= 0.98;
			particle.velocityY *= 0.98;
			
			// 부드러운 회전 (나뭇잎처럼)
			const rotationVariation = Math.sin(particle.time * 0.02) * 0.5;
			particle.rotation += particle.rotationSpeed + rotationVariation;
			
			// 화면 경계 처리
			if (particle.x < -5) particle.x = 105;
			if (particle.x > 105) particle.x = -5;
			
			// 화면 아래로 벗어나면 재생성
			if (particle.y > 110) {
				const newParticle = createParticle(particle.id);
				newParticle.initialX = newParticle.x;
				return newParticle;
			}
			
			return particle;
		});

		if (browser) {
			animationId = requestAnimationFrame(updateParticles);
		}
	}

	// === 생명주기 ===
	onMount(() => {
		if (!browser) return;
		
		initParticles();
		updateParticles();
		
		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	});
</script>

<!-- 별 가루 파티클 컨테이너 -->
<div 
	bind:this={containerRef}
	class={[
		'fixed inset-0 w-screen h-screen',
		'pointer-events-none overflow-hidden',
		'z-0'
	]}
>
	{#each particles as particle (particle.id)}
		<div
			class={[
				'absolute will-change-transform',
				'transition-opacity duration-1000 ease-out'
			]}
			style="
				left: {particle.x}%;
				top: {particle.y}%;
				transform: translate(-50%, -50%) rotate({particle.rotation}deg);
				opacity: {particle.opacity};
				font-size: {particle.size}rem;
			"
		>
			<!-- 별 모양 SVG -->
			<svg 
				viewBox="0 0 24 24" 
				class={[
					'w-8 h-8 drop-shadow-lg',
					'text-yellow-300'
				]}
				style="
					filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.8)) 
					        drop-shadow(0 0 24px rgba(255, 215, 0, 0.4))
					        drop-shadow(0 0 6px rgba(255, 255, 255, 0.6));
				"
			>
				<!-- 6각 별 모양 -->
				<path
					fill="currentColor"
					d="M12 2l2.09 6.26L20 8.27l-5.91 4.33L16.18 22L12 18.27L7.82 22l2.09-9.4L4 8.27l5.91-.01L12 2z"
				/>
			</svg>
		</div>
	{/each}
</div>

<style>
	/* 성능 최적화를 위한 GPU 가속 */
	div {
		backface-visibility: hidden;
		perspective: 1000px;
	}
</style>
