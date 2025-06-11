<script>
	/**
	 * @typedef {Object} Props
	 * @property {'primary'|'secondary'|'tertiary'} [variant='primary'] - 카드 스타일 변형
	 * @property {'none'|'sm'|'md'|'lg'|'xl'} [padding='md'] - 패딩 크기
	 * @property {boolean} [hover=true] - 호버 효과 여부
	 * @property {boolean} [border=true] - 테두리 여부
	 * @property {string} [class] - 추가 CSS 클래스
	 */

	/** @type {Props} */
	const {
		variant = 'primary',
		padding = 'md',
		hover = true,
		border = true,
		class: className = ''
	} = $props();

	const variantClasses = {
		primary: 'bg-white/30',
		secondary: 'bg-white/20',
		tertiary: 'bg-white/15'
	};

	const paddingClasses = {
		none: '',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8',
		xl: 'p-10'
	};

	const baseClasses = 'backdrop-blur-sm shadow-2xl transition-all duration-300 rounded-3xl';
	const borderClasses = border ? 'border border-white/40' : '';
	const hoverClasses = hover
		? 'hover:bg-white/40 hover:transform hover:scale-[1.02] hover:shadow-3xl'
		: '';

	const cardClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${borderClasses} ${hoverClasses} ${className}`;
</script>

<div class={cardClasses}>
	<slot />
</div>
