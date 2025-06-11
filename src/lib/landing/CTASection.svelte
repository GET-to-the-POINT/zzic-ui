<script>
	import { Button } from '$lib/components/ui/button';
</script>

<section class="py-20 px-4 bg-muted/30">
	<div class="max-w-4xl mx-auto text-center">
		<div class="mb-12">
			<h2 class="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
				지금 바로 시작하세요
			</h2>
			<p class="text-xl md:text-2xl text-muted-foreground mb-4">
				매일이 설레는 투두리스트와 함께
			</p>
			<p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
				친구들과 함께 목표를 달성하고, AI의 도움도 받고, 
				재미있는 챌린지로 매일을 더 특별하게 만들어보세요
			</p>
		</div>

		<div class="grid sm:grid-cols-2 gap-4 justify-center items-center mb-12 max-w-md mx-auto">
			<Button size="lg" class="text-lg font-semibold">
				무료로 시작하기
			</Button>
			
			<Button variant="outline" size="lg" class="text-lg font-medium">
				더 알아보기
			</Button>
		</div>

		<!-- 특별 혜택 -->
		<div class="bg-card rounded-lg p-8 border">
			<div class="text-center">
				<h3 class="text-2xl font-bold text-foreground mb-6">
					지금 가입하면 특별 혜택
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
					<div>
						<h4 class="font-semibold text-foreground mb-2">프리미엄 테마</h4>
						<p class="text-sm text-muted-foreground">다양한 테마 3개 무료 제공</p>
					</div>
					<div>
						<h4 class="font-semibold text-foreground mb-2">AI 추천 무제한</h4>
						<p class="text-sm text-muted-foreground">첫 달 AI 기능 무료 이용</p>
					</div>
					<div>
						<h4 class="font-semibold text-foreground mb-2">얼리 어답터 배지</h4>
						<p class="text-sm text-muted-foreground">특별한 초기 사용자 인증</p>
					</div>
				</div>
				<p class="text-sm text-muted-foreground mt-6">
					한정된 기간 동안만 제공되는 특별 혜택입니다
				</p>
			</div>
		</div>
	</div>
</section>
