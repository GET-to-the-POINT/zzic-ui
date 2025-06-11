<script>
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
</script>

<section class="py-20 px-4">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16">
			<h2 class="text-4xl md:text-5xl font-bold text-foreground mb-4">
				함께하면 더 좋습니다
			</h2>
			<p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
				혼자서는 힘들었던 목표들도 친구들과 함께라면 
				재미있게 달성할 수 있습니다
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
			<!-- 실시간 응원 -->
			<Card>
				<CardHeader>
					<CardTitle class="text-lg text-primary">
						실시간 응원 메시지
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p class="text-muted-foreground">
						친구가 목표를 달성했을 때 바로 축하 메시지를 보내보세요. 
						서로 격려하며 더 열심히 할 수 있습니다.
					</p>
				</CardContent>
			</Card>

			<!-- 랭킹 시스템 -->
			<Card>
				<CardHeader>
					<CardTitle class="text-lg text-secondary">
						친근한 랭킹 시스템
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p class="text-muted-foreground">
						이번 주 가장 열심히 한 친구는 누구일까요? 
						경쟁이 아닌 서로를 응원하는 따뜻한 랭킹입니다.
					</p>
				</CardContent>
			</Card>

			<!-- 함께 도전 -->
			<Card>
				<CardHeader>
					<CardTitle class="text-lg text-accent">
						함께 도전하기
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p class="text-muted-foreground">
						같은 목표를 가진 친구들과 팀을 만들어 함께 도전해보세요. 
						혼자였다면 포기했을 일도 끝까지 해낼 수 있습니다.
					</p>
				</CardContent>
			</Card>
		</div>

		<!-- 커뮤니티 통계 -->
		<div class="bg-card rounded-lg p-8">
			<div class="text-center mb-8">
				<h3 class="text-2xl md:text-3xl font-bold text-foreground mb-4">
					우리 커뮤니티 현황
				</h3>
			</div>
			
			<div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
				<div>
					<div class="text-3xl md:text-4xl font-bold text-primary">
						12,345
					</div>
					<p class="text-muted-foreground mt-1">함께하는 사용자</p>
				</div>
				<div>
					<div class="text-3xl md:text-4xl font-bold text-secondary">
						89,012
					</div>
					<p class="text-muted-foreground mt-1">완료된 투두</p>
				</div>
				<div>
					<div class="text-3xl md:text-4xl font-bold text-accent">
						456
					</div>
					<p class="text-muted-foreground mt-1">진행중인 챌린지</p>
				</div>
				<div>
					<div class="text-3xl md:text-4xl font-bold text-chart-1">
						98%
					</div>
					<p class="text-muted-foreground mt-1">사용자 만족도</p>
				</div>
			</div>
		</div>
	</div>
</section>
