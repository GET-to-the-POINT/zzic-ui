<script>
	import { page } from '$app/state';
import Gauge from '@lucide/svelte/icons/gauge';
import Menu from '@lucide/svelte/icons/menu';
import Plus from '@lucide/svelte/icons/plus';
</script>

<div class="h-16"></div> <!-- Placeholder for fixed bottom navigation -->

<nav class="fixed bottom-0 left-0 right-0 z-50 h-16 preset-filled-surface-500 border-t border-primary-500">
	<div class="flex h-full">
		<!-- 대시보드 -->
		<a
			href="/dashboard"
			class="flex-1 flex flex-col items-center justify-center"
		>
		   <Gauge size={20} />
			<span class="text-xs mt-0.5">대시보드</span>
		</a>

		<!-- 생성 -->
		<a
			href={`/todos/create?redirectTo=${page.url.pathname}${encodeURIComponent(page.url.search)}`}
			class="flex-1 flex flex-col items-center justify-center"
		>
			<div class="preset-filled-secondary-500 rounded-full p-1">
				<Plus size={18} />
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