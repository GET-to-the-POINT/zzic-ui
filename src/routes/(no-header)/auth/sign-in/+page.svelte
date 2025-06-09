<script>
	import { enhance } from '$app/forms';
	import Heart from '@lucide/svelte/icons/heart';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	
	const { form } = $props();
</script>

<div class={[
	'min-h-screen flex items-center justify-center p-4',
	'relative z-10'
]}>
	<div class={[
		'w-full max-w-md',
		'bg-white/20 backdrop-blur-md',
		'border border-white/30',
		'rounded-3xl shadow-2xl',
		'p-8 space-y-6',
		'transform hover:scale-[1.02] hover:shadow-3xl',
		'transition-all duration-300'
	]}>
		<!-- 에러 표시 -->
		{#if form}
			<div class={[
				'bg-red-100/50 backdrop-blur-sm',
				'border border-red-200/50',
				'error-text p-3 rounded-2xl',
				'text-sm font-medium'
			]}>
				{JSON.stringify(form)}
			</div>
		{/if}

		<!-- 헤더 -->
		<div class="text-center space-y-2">
			<div class={[
				'inline-flex items-center justify-center',
				'w-16 h-16 rounded-full',
				'bg-gradient-to-br from-pink-200 to-purple-200',
				'shadow-lg mb-4'
			]}>
				<Heart class="w-8 h-8 text-pink-500 animate-pulse" />
			</div>
			
			<h1 class={[
				'text-4xl font-bold',
				'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500',
				'bg-clip-text text-transparent',
				'drop-shadow-lg'
			]}>
				로그인
			</h1>
			
			<p class={[
				'font-medium'
			]}>
				꿈을 관리하는 달콤한 공간으로 돌아오세요 ✨
			</p>
		</div>

		<!-- 로그인 폼 -->
		<form method="POST" use:enhance class="space-y-4">
			<div class="space-y-1">
				<label for="email" class={[
					'block text-sm font-medium',
					'mb-2'
				]}>
					이메일
				</label>
				<input 
					name="email" 
					id="email" 
					type="email" 
					required 
					class={[
						'w-full px-4 py-3',
						'bg-white/50 backdrop-blur-sm',
						'border-2 border-white/40',
						'rounded-2xl',
						'focus:outline-none focus:border-pink-300 focus:bg-white/70',
						'transition-all duration-300',
						'hover:bg-white/60'
					]}
					placeholder="example@email.com"
				/>
			</div>

			<div class="space-y-1">
				<label for="password" class={[
					'block text-sm font-medium',
					'mb-2'
				]}>
					비밀번호
				</label>
				<input 
					name="password" 
					id="password" 
					type="password" 
					class={[
						'w-full px-4 py-3',
						'bg-white/50 backdrop-blur-sm',
						'border-2 border-white/40',
						'rounded-2xl',
						'focus:outline-none focus:border-pink-300 focus:bg-white/70',
						'transition-all duration-300',
						'hover:bg-white/60'
					]}
					placeholder="••••••••"
				/>
			</div>

			<button 
				type="submit" 
				class={[
					'group w-full py-3 px-6',
					'bg-gradient-to-r from-pink-400 via-pink-300 to-purple-400',
					'text-white font-bold text-lg',
					'rounded-2xl shadow-lg',
					'hover:from-pink-500 hover:via-pink-400 hover:to-purple-500',
					'hover:scale-105 hover:-translate-y-1',
					'active:scale-98',
					'transition-all duration-300',
					'flex items-center justify-center gap-2',
					'focus:outline-none focus:ring-4 focus:ring-pink-200'
				]}
			>
				<Sparkles class="w-5 h-5 group-hover:animate-spin" />
				로그인
			</button>
		</form>

		<!-- 회원가입 링크 -->
		<div class="text-center pt-4">
			<p class="text-sm">
				계정이 없으신가요?
			</p>
			<a 
				href="/auth/sign-up" 
				class={[
					'inline-block mt-2 px-6 py-2',
					'font-medium',
					'bg-white/30 backdrop-blur-sm',
					'border border-white/40',
					'rounded-full',
					'hover:bg-white/50',
					'hover:scale-105 hover:-translate-y-0.5',
					'transition-all duration-300',
					'focus:outline-none focus:ring-2 focus:ring-pink-200'
				]}
			>
				회원가입하기
			</a>
		</div>
	</div>
</div>