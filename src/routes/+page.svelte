<script>
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Award from '@lucide/svelte/icons/award';
	import Bot from '@lucide/svelte/icons/bot';
	import ChartColumn from '@lucide/svelte/icons/chart-column';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import Flame from '@lucide/svelte/icons/flame';
	import Play from '@lucide/svelte/icons/play';
	import Star from '@lucide/svelte/icons/star';
	import Target from '@lucide/svelte/icons/target';
	import Timer from '@lucide/svelte/icons/timer';
	import Users from '@lucide/svelte/icons/users';
	import Zap from '@lucide/svelte/icons/zap';
</script>

<div class="min-h-screen">
	<!-- Hero Section -->
	<section class="pt-24 pb-20 px-6">
		<div class="max-w-6xl mx-auto">
			<div class="text-center space-y-4">
				<span class="badge preset-tonal-primary">✨ AI 기반 생산성 플랫폼</span>
				<h1 class="h1">목표를 현실로,<br /><span class="text-primary-500">ZZIC과 함께</span></h1>
				<p class="text-xl opacity-60 max-w-2xl mx-auto">
					AI 도우미, 스마트한 습관 추적, 집중 타이머까지.<br />당신의 생산성을 한 단계 끌어올리는
					올인원 솔루션입니다.
				</p>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
					<a href="/todos" class="btn preset-tonal-primary">
						무료로 시작하기
						<ArrowRight size={16} />
					</a>
					<button class="btn preset-outlined-primary-500">
						<Play size={16} />
						데모 보기
					</button>
				</div>
			</div>

			<!-- Dashboard Preview -->
			<div class="mt-16 max-w-4xl mx-auto">
				<div class="card preset-tonal-surface p-6">
					<div class="card preset-tonal-surface p-4 mb-6">
						<div class="grid grid-cols-3 gap-2">
							<div class="w-3 h-3 rounded-full bg-error-500"></div>
							<div class="w-3 h-3 rounded-full bg-warning-500"></div>
							<div class="w-3 h-3 rounded-full bg-success-500"></div>
						</div>
						<div class="text-sm opacity-60 mt-2">ZZIC Dashboard</div>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div class="card preset-tonal-primary p-4">
							<div class="grid grid-cols-[1fr_auto] gap-4 items-center">
								<div>
									<p class="text-sm opacity-60">오늘 할 일</p>
									<p class="text-2xl font-bold">8/12</p>
								</div>
								<CircleCheck size={32} />
							</div>
						</div>
						<div class="card preset-tonal-warning p-4">
							<div class="grid grid-cols-[1fr_auto] gap-4 items-center">
								<div>
									<p class="text-sm opacity-60">연속 기록</p>
									<p class="text-2xl font-bold">15일</p>
								</div>
								<Flame size={32} />
							</div>
						</div>
						<div class="card preset-tonal-secondary p-4">
							<div class="grid grid-cols-[1fr_auto] gap-4 items-center">
								<div>
									<p class="text-sm opacity-60">집중 시간</p>
									<p class="text-2xl font-bold">4.5h</p>
								</div>
								<Timer size={32} />
							</div>
						</div>
					</div>

					<!-- Floating badges -->
					<div class="relative">
						<div class="absolute -top-4 -right-4 card preset-tonal-surface p-3 animate-bounce">
							<div class="grid grid-cols-[auto_1fr] gap-2 items-center">
								<Bot size={16} class="text-primary-500" />
								<span class="text-sm">AI 추천 완료!</span>
							</div>
						</div>
						<div class="absolute -bottom-4 -left-4 card preset-tonal-surface p-3 animate-pulse">
							<div class="grid grid-cols-[auto_1fr] gap-2 items-center">
								<Award size={16} class="text-warning-500" />
								<span class="text-sm">목표 달성 🎉</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section id="features" class="py-20">
		<div class="max-w-6xl mx-auto px-6">
			<div class="text-center mb-16 space-y-4">
				<h2 class="h2">생산성을 높이는 <span class="text-primary-500">4가지 핵심 기능</span></h2>
				<p class="text-xl opacity-60 max-w-2xl mx-auto">
					복잡한 도구는 그만. 하나의 플랫폼에서 모든 것을 해결하세요.
				</p>
			</div>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
				<div class="space-y-4">
					<div class="card preset-tonal-surface p-6 hover:preset-tonal-primary transition-all">
						<div class="grid grid-cols-[auto_1fr] gap-4">
							<div class="w-12 h-12 rounded-lg preset-tonal-primary grid place-items-center">
								<CircleCheck size={24} />
							</div>
							<div>
								<h3 class="h4 mb-2">AI 도우미</h3>
								<p class="opacity-60">똑똑한 AI가 당신의 생산성을 분석하고 맞춤 제안을 드려요</p>
							</div>
						</div>
					</div>
					<div class="card preset-tonal-surface p-6 hover:preset-tonal-warning transition-all">
						<div class="grid grid-cols-[auto_1fr] gap-4">
							<div class="w-12 h-12 rounded-lg preset-tonal-warning grid place-items-center">
								<Timer size={24} />
							</div>
							<div>
								<h3 class="h4 mb-2">집중 타이머</h3>
								<p class="opacity-60">포모도로 기법으로 집중력을 극대화하고 생산성을 높여보세요</p>
							</div>
						</div>
					</div>
					<div class="card preset-tonal-surface p-6 hover:preset-tonal-error transition-all">
						<div class="grid grid-cols-[auto_1fr] gap-4">
							<div class="w-12 h-12 rounded-lg preset-tonal-error grid place-items-center">
								<Flame size={24} />
							</div>
							<div>
								<h3 class="h4 mb-2">습관 추적</h3>
								<p class="opacity-60">매일의 작은 습관들이 모여 큰 변화를 만들어냅니다</p>
							</div>
						</div>
					</div>
					<div class="card preset-tonal-primary p-6">
						<div class="grid grid-cols-[auto_1fr] gap-4">
							<div class="w-12 h-12 rounded-lg preset-tonal-secondary grid place-items-center">
								<ChartColumn size={24} />
							</div>
							<div>
								<h3 class="h4 mb-2">인사이트 분석</h3>
								<p class="opacity-60">
									데이터 기반으로 당신의 생산성 패턴을 파악하고 개선점을 찾아요
								</p>
							</div>
						</div>
					</div>
				</div>
				<div class="card preset-tonal-surface p-8 text-center space-y-4">
					<div class="w-16 h-16 mx-auto rounded-full preset-tonal-primary grid place-items-center">
						<ChartColumn size={32} />
					</div>
					<h4 class="h4">인사이트 분석</h4>
					<div class="card preset-filled-surface-100-900 p-4">
						<p>📊 이번 주 완료율 85% (+15% ↑)</p>
					</div>
					<div class="grid grid-cols-4 gap-2 justify-center">
						<div class="w-2 h-2 rounded-full bg-surface-300"></div>
						<div class="w-2 h-2 rounded-full bg-surface-300"></div>
						<div class="w-2 h-2 rounded-full bg-surface-300"></div>
						<div class="w-2 h-2 rounded-full bg-primary-500"></div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Stats Section -->
	<section id="stats" class="py-20 preset-tonal-primary">
		<div class="max-w-6xl mx-auto px-6">
			<div class="text-center mb-12 space-y-4">
				<h2 class="h2 text-white">함께 성장하는 커뮤니티</h2>
				<p class="text-xl text-white opacity-60 max-w-2xl mx-auto">
					전 세계 사용자들이 ZZIC과 함께 목표를 달성하고 있어요
				</p>
			</div>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
				<div class="text-center text-white">
					<div class="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full grid place-items-center">
						<Users size={32} />
					</div>
					<div class="text-3xl font-bold mb-2">10,000+</div>
					<div class="opacity-60">누적 사용자</div>
				</div>
				<div class="text-center text-white">
					<div class="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full grid place-items-center">
						<CircleCheck size={32} />
					</div>
					<div class="text-3xl font-bold mb-2">500K+</div>
					<div class="opacity-60">완료된 할 일</div>
				</div>
				<div class="text-center text-white">
					<div class="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full grid place-items-center">
						<Target size={32} />
					</div>
					<div class="text-3xl font-bold mb-2">50K+</div>
					<div class="opacity-60">달성된 목표</div>
				</div>
				<div class="text-center text-white">
					<div class="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full grid place-items-center">
						<Timer size={32} />
					</div>
					<div class="text-3xl font-bold mb-2">1M+ 분</div>
					<div class="opacity-60">집중 시간</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Testimonials Section -->
	<section id="testimonials" class="py-20">
		<div class="max-w-6xl mx-auto px-6">
			<div class="text-center mb-16 space-y-4">
				<h2 class="h2">사용자들의 <span class="text-primary-500">생생한 후기</span></h2>
				<p class="text-xl opacity-60">ZZIC으로 변화된 일상을 확인해보세요</p>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div class="card preset-tonal-surface p-6 hover:card-hover transition-all">
					<div class="grid grid-cols-5 gap-1 mb-4">
						{#each Array(5) as _}
							<Star size={16} class="text-warning-500 fill-current" />
						{/each}
					</div>
					<p class="mb-4 opacity-80">
						"ZZIC 덕분에 업무 효율이 2배 늘었어요. AI 추천이 정말 정확해요!"
					</p>
					<div class="border-t pt-4">
						<div class="font-medium">김민수</div>
						<div class="text-sm opacity-60">프로덕트 매니저</div>
					</div>
				</div>
				<div class="card preset-tonal-surface p-6 hover:card-hover transition-all">
					<div class="grid grid-cols-5 gap-1 mb-4">
						{#each Array(5) as _}
							<Star size={16} class="text-warning-500 fill-current" />
						{/each}
					</div>
					<p class="mb-4 opacity-80">
						"습관 추적 기능이 최고예요. 매일 운동하는 습관을 만들 수 있었어요."
					</p>
					<div class="border-t pt-4">
						<div class="font-medium">이지은</div>
						<div class="text-sm opacity-60">디자이너</div>
					</div>
				</div>
				<div class="card preset-tonal-surface p-6 hover:card-hover transition-all">
					<div class="grid grid-cols-5 gap-1 mb-4">
						{#each Array(5) as _}
							<Star size={16} class="text-warning-500 fill-current" />
						{/each}
					</div>
					<p class="mb-4 opacity-80">"포모도로 타이머로 집중력이 많이 향상됐습니다. 추천해요!"</p>
					<div class="border-t pt-4">
						<div class="font-medium">박준형</div>
						<div class="text-sm opacity-60">개발자</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Final CTA Section -->
	<section class="py-20">
		<div class="max-w-4xl mx-auto px-6 text-center space-y-4">
			<h2 class="h2">오늘부터 <span class="text-primary-500">더 나은 나</span>와 만나보세요</h2>
			<p class="text-xl opacity-60 max-w-2xl mx-auto">
				지금 시작하면 무료로 모든 기능을 사용할 수 있어요. 신용카드도 필요 없습니다.
			</p>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
				<a href="/auth/sign-in" class="btn preset-tonal-primary">
					무료로 시작하기
					<ArrowRight size={16} />
				</a>
				<button class="btn preset-outlined-surface-500">더 자세히 알아보기</button>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm opacity-60 max-w-md mx-auto">
				<div class="grid grid-cols-[auto_1fr] gap-2 items-center">
					<CircleCheck size={16} class="text-success-500" />
					<span>무료 사용</span>
				</div>
				<div class="grid grid-cols-[auto_1fr] gap-2 items-center">
					<CircleCheck size={16} class="text-success-500" />
					<span>카드 등록 불필요</span>
				</div>
				<div class="grid grid-cols-[auto_1fr] gap-2 items-center">
					<CircleCheck size={16} class="text-success-500" />
					<span>언제든 해지 가능</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="py-12 preset-filled-surface-100-900">
		<div class="max-w-6xl mx-auto px-6">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
				<div>
					<div class="grid grid-cols-[auto_1fr] gap-2 items-center mb-4">
						<div class="w-8 h-8 rounded-lg preset-tonal-primary grid place-items-center">
							<Zap size={20} />
						</div>
						<span class="text-xl font-medium">ZZIC</span>
					</div>
					<p class="opacity-60">생산성을 높이는 가장 스마트한 방법</p>
				</div>
				<div>
					<h4 class="font-medium mb-4">제품</h4>
					<div class="space-y-2 opacity-60">
						<div><a href="/features" class="hover:opacity-100 transition-opacity">기능</a></div>
						<div><a href="/pricing" class="hover:opacity-100 transition-opacity">요금제</a></div>
						<div><a href="/api" class="hover:opacity-100 transition-opacity">API</a></div>
					</div>
				</div>
				<div>
					<h4 class="font-medium mb-4">지원</h4>
					<div class="space-y-2 opacity-60">
						<div><a href="/help" class="hover:opacity-100 transition-opacity">도움말</a></div>
						<div><a href="/contact" class="hover:opacity-100 transition-opacity">문의하기</a></div>
						<div>
							<a href="/community" class="hover:opacity-100 transition-opacity">커뮤니티</a>
						</div>
					</div>
				</div>
				<div>
					<h4 class="font-medium mb-4">회사</h4>
					<div class="space-y-2 opacity-60">
						<div><a href="/about" class="hover:opacity-100 transition-opacity">소개</a></div>
						<div><a href="/blog" class="hover:opacity-100 transition-opacity">블로그</a></div>
						<div><a href="/careers" class="hover:opacity-100 transition-opacity">채용</a></div>
					</div>
				</div>
			</div>
			<div class="border-t mt-8 pt-8 text-center opacity-60">
				<p>© 2025 ZZIC. All rights reserved.</p>
			</div>
		</div>
	</footer>

	<!-- Scroll Indicator -->
	<div class="fixed bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
		<ChevronDown size={24} class="text-primary-500" />
	</div>
</div>
