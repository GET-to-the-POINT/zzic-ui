<script>
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
</script>

<section class="py-20 px-4">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16">
			<h2 class="text-4xl md:text-5xl font-bold text-foreground mb-4">
				특별한 기능들
			</h2>
			<p class="text-lg md:text-xl text-muted-foreground">
				ZZIC과 함께라면 할 일 관리가 이렇게 쉬워집니다
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<!-- 챌린지 기능 -->
			<Card>
				<CardHeader>
					<CardTitle class="text-xl text-primary">
						챌린지 함께하기
					</CardTitle>
					<CardDescription>
						친구들과 함께하는 투두 챌린지
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p class="text-muted-foreground">
						혼자서는 어려운 목표도 친구들과 함께라면 가능합니다. 
						서로 응원하며 같은 목표를 향해 나아가세요.
					</p>
				</CardContent>
			</Card>

			<!-- 나만의 투두 -->
			<Card>
				<CardHeader>
					<CardTitle class="text-xl text-secondary">
						나만의 특별한 공간
					</CardTitle>
					<CardDescription>
						개인 맞춤형 투두리스트
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p class="text-muted-foreground">
						나만의 페이스로, 나만의 스타일로 관리하세요. 
						개인적인 목표들을 체계적으로 정리하고 차근차근 달성해보세요.
					</p>
				</CardContent>
			</Card>

			<!-- AI 추천 -->
			<Card>
				<CardHeader>
					<CardTitle class="text-xl text-accent">
						AI 추천 기능
					</CardTitle>
					<CardDescription>
						똑똑한 인공지능 할일 도우미
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p class="text-muted-foreground">
						무엇을 해야 할지 고민이시라면 AI가 도움을 드립니다. 
						당신의 라이프스타일에 맞는 적절한 할 일을 제안해드립니다.
					</p>
				</CardContent>
			</Card>

			<!-- 인기 투두 -->
			<Card>
				<CardHeader>
					<CardTitle class="text-xl text-chart-3">
						지금 인기있는 투두
					</CardTitle>
					<CardDescription>
						트렌드를 확인해보세요
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p class="text-muted-foreground">
						요즘 사람들이 가장 많이 하는 투두가 궁금하시다면? 
						트렌디한 목표들을 발견하고 함께 도전해보세요.
					</p>
				</CardContent>
			</Card>
		</div>
	</div>
</section>
