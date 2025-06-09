<script>
	import { enhance } from '$app/forms';
	import Heart from '@lucide/svelte/icons/heart';
</script>


<div class="min-h-screen flex items-center justify-center p-4 relative z-10">
	<div class="w-full max-w-md">
		<!-- Glass Morphism Container -->
		<div class="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-pink-500/20">
			<form method="POST" class="space-y-6" use:enhance>
				<!-- Gradient Title -->
				<div class="text-center space-y-4">
					<div class="flex justify-center">
						<Heart class="w-8 h-8 text-pink-500 animate-pulse" />
					</div>
					<h1 class="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
						로그아웃
					</h1>
					<p class="leading-relaxed">
						정말로 로그아웃 하시겠습니까?<br>
						<span class="text-sm">언제든지 다시 돌아오세요 💕</span>
					</p>
				</div>

				<!-- Action Buttons -->
				<div class="space-y-3">
					<!-- Logout Button -->
					<button 
						type="submit" 
						class="w-full py-4 px-6 bg-gradient-to-r from-pink-500/80 to-purple-500/80 text-white font-medium rounded-2xl transition-all duration-300 hover:from-pink-500 hover:to-purple-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-500/25 active:scale-[0.98] backdrop-blur-sm border border-white/20"
					>
						<span class="flex items-center justify-center gap-2">
							<Heart class="w-4 h-4" />
							로그아웃
						</span>
					</button>

					<!-- Cancel Button -->
					<a 
						href="/" 
						class="block w-full py-4 px-6 bg-white/30 font-medium rounded-2xl transition-all duration-300 hover:bg-white/40 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] backdrop-blur-sm border border-white/30 text-center"
					>
						취소하고 돌아가기
					</a>
				</div>
			</form>
		</div>
	</div>
</div>

