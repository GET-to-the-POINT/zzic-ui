<script>
	/**
	 * @typedef {Object} Props
	 * @property {'primary'|'secondary'|'success'|'warning'|'danger'} variant - 버튼 색상 변형
	 * @property {'sm'|'md'|'lg'} size - 버튼 크기
	 * @property {boolean} [disabled=false] - 비활성화 상태
	 * @property {'button'|'submit'|'reset'} [type='button'] - 버튼 타입
	 * @property {string} [class] - 추가 CSS 클래스
	 * @property {Function} [onclick] - 클릭 이벤트 핸들러
	 */

	/** @type {Props} */
	const {
		variant = 'primary',
		size = 'md',
		disabled = false,
		type = 'button',
		class: className = '',
		onclick,
		...restProps
	} = $props();

	const variantClasses = {
		primary: 'bg-blue-400 hover:bg-blue-500',
		secondary: 'bg-gray-400 hover:bg-gray-500',
		success: 'bg-green-400 hover:bg-green-500',
		warning: 'bg-yellow-400 hover:bg-yellow-500',
		danger: 'bg-red-400 hover:bg-red-500'
	};

	const sizeClasses = {
		sm: 'p-2',
		md: 'p-3',
		lg: 'p-4'
	};

	const baseClasses =
		'group text-white rounded-full transition-all duration-300 transform hover:scale-110 flex items-center justify-center';

	const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100' : ''}`;
</script>

<button {type} {disabled} {onclick} class={buttonClasses} {...restProps}>
	<slot />
</button>
