<script>
	import { page } from '$app/state';
	import SquareCheckBig from '@lucide/svelte/icons/square-check-big';
	import Plus from '@lucide/svelte/icons/plus';
	import Menu from '@lucide/svelte/icons/menu';

	const currentPath = $derived(page.url.pathname);

	const isActive = (path) => {
		if (path === '/todos') {
			return currentPath === '/todos' || currentPath.startsWith('/todos/');
		}
		return currentPath === path;
	};
</script>

<nav class="fixed bottom-0 left-0 right-0 z-50 h-16 preset-filled-surface-50-950 border-t border-primary-500">
	<div class="flex h-full">
		<!-- 투두 -->
		<a
			href="/todos"
			class="flex-1 flex flex-col items-center justify-center"
			class:text-primary-500={isActive('/todos')}
			class:text-surface-600-300={!isActive('/todos')}
		>
			<SquareCheckBig size={20} />
			<span class="text-xs mt-0.5">투두</span>
		</a>

		<!-- 생성 -->
		<a
			href="/todos/create"
			class="flex-1 flex flex-col items-center justify-center text-secondary-500"
		>
			<div class="bg-secondary-500 rounded-full p-1">
				<Plus size={18} class="text-white" />
			</div>
			<span class="text-xs mt-0.5">생성</span>
		</a>

		<!-- 메뉴 -->
		<a
			href="/menu"
			class="flex-1 flex flex-col items-center justify-center text-surface-600-300"
		>
			<Menu size={20} />
			<span class="text-xs mt-0.5">메뉴</span>
		</a>
	</div>
</nav>