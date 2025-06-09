<script>
	import GlassButton from '$lib/ui/GlassButton.svelte';
	import GradientButton from '$lib/ui/GradientButton.svelte';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import Plus from '@lucide/svelte/icons/plus';

	const onSecondaryClick = () => alert('곧 출시될 기능입니다! 🎉');
</script>

<div class="space-y-4">
	<!-- 메인 버튼 -->
	<GradientButton 
		as="a"
		href="/members/me/todos"
		variant="primary"
		size="lg"
		class="size-1/2 mx-auto"
	>
		<CheckCircle2 size={24} />
		<span>일정관리 시작하기</span>
	</GradientButton>
	<!-- 보조 버튼 -->
	<GlassButton 
		size="lg"
		onclick={onSecondaryClick}
		variant="ghost"
		class="size-1/2 mx-auto"
	>
		<Plus size={24} />
		<span>기능 둘러보기</span>
	</GlassButton>
</div>