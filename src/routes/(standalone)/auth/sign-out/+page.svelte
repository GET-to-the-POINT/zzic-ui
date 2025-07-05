<script>
	import { enhance } from '$app/forms';
	import LogOut from '@lucide/svelte/icons/log-out';
</script>

<main class="p-4 space-y-4">
	<div class="card p-6 preset-filled-surface-50-950 max-w-md mx-auto">
		<div class="text-center space-y-6">
			<!-- 아이콘 -->
			<div class="flex justify-center">
				<div class="w-16 h-16 rounded-full preset-filled-secondary-500 flex items-center justify-center">
					<LogOut size="32" />
				</div>
			</div>
			
			<!-- 텍스트 -->
			<div class="space-y-2">
				<h2 class="text-2xl font-bold">로그아웃 하시겠습니까?</h2>
				<p class="text-surface-600-400">언제든지 다시 로그인하실 수 있습니다</p>
			</div>
			
			<!-- 버튼들 -->
			<div class="flex flex-col sm:flex-row gap-3 pt-2">
				<form method="POST" action="/auth/sign-out" use:enhance class="flex-1">
					<button type="submit" class="btn preset-filled-secondary-500 w-full">
						<LogOut size="20" />
						<span>로그아웃</span>
					</button>
				</form>
				
				<a href="/dashboard" class="btn preset-tonal-surface w-full sm:flex-1">
					<span>취소</span>
				</a>
			</div>
		</div>
	</div>
</main>
