<script>
	/**
	 * @typedef {Object} Props
	 * @property {'sm'|'md'|'lg'|'xl'|'hero'} size - 텍스트 크기
	 * @property {'primary'|'secondary'|'rainbow'} variant - 그라데이션 변형
	 * @property {boolean} [animated=false] - 애니메이션 여부
	 * @property {boolean} [glow=false] - 글로우 효과 여부
	 * @property {string} [class] - 추가 CSS 클래스
	 */

	/** @type {Props} */
	const { 
		size = 'md',
		variant = 'primary',
		animated = false,
		glow = false,
		class: className = ''
	} = $props();

	const sizeClasses = {
		sm: 'text-lg',
		md: 'text-2xl',
		lg: 'text-4xl',
		xl: 'text-6xl',
		hero: 'text-8xl md:text-9xl'
	};

	const variantClasses = {
		primary: 'from-pink-500 via-purple-500 to-blue-500',
		secondary: 'from-blue-500 via-cyan-500 to-purple-500',
		rainbow: 'from-pink-500 via-purple-500 via-blue-500 via-green-500 to-yellow-500'
	};

	const baseClasses = 'font-black text-transparent bg-gradient-to-r bg-clip-text drop-shadow-2xl';
	
	const textClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${animated ? 'animate-gradient-shift' : ''} ${glow ? 'text-glow' : ''}`;
</script>

<h1 class={textClasses}>
	<slot />
</h1>

<style>
	@keyframes gradient-shift {
		0%, 100% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
	}
	
	.animate-gradient-shift {
		background-size: 200% 200%;
		animation: gradient-shift 3s ease infinite;
	}
	
	.text-glow {
		text-shadow: 
			0 0 10px rgba(236, 72, 153, 0.3),
			0 0 20px rgba(147, 51, 234, 0.2),
			0 0 30px rgba(59, 130, 246, 0.1);
	}
	
	.text-glow:hover {
		animation: rainbow 1s linear infinite;
	}
	
	@keyframes rainbow {
		0% { filter: hue-rotate(0deg); }
		100% { filter: hue-rotate(360deg); }
	}
	
	/* 반응형 폰트 크기 */
	@media (max-width: 768px) {
		.text-8xl {
			font-size: 4rem !important;
		}
	}
	
	@media (max-width: 480px) {
		.text-8xl {
			font-size: 3rem !important;
		}
	}
</style>
