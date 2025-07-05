<script>
	import { Gauge, Menu, Plus } from '@lucide/svelte';
	import { page } from '$app/state';

	const search = $derived.by(() => {
		const isModal = page.data.meta?.modal;
		if (!isModal) {
			return '';
		}
		const searchParams = new URLSearchParams();
		searchParams.set('redirectTo', page.url.pathname + page.url.search);
		return `?${searchParams.toString()}`;
	});
</script>

<nav
	class="card rounded-b-none sticky bottom-0 h-16 preset-filled-surface-50-950 border-t border-primary-500/50"
>
	<div class="flex h-full justify-around">
		<!-- 대시보드 -->
		<a href="/dashboard" class="btn flex-col">
			<Gauge size={18} />
			<span class="text-xs mt-0.5">대시보드</span>
		</a>

		<!-- 생성 -->
		<a href={`/todos/create${search}`} class="btn flex-col">
			<Plus size={18} />
			<span class="text-xs mt-0.5">생성</span>
		</a>

		<!-- 메뉴 -->
		<a href="/menu" class="btn flex-col">
			<Menu size={18} />
			<span class="text-xs mt-0.5">메뉴</span>
		</a>
	</div>
</nav>
