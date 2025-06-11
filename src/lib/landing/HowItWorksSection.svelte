<script>
	import { Card, CardContent } from '$lib/components/ui/card';
</script>

<section class="py-20 px-4 bg-muted/30">
	<div class="max-w-4xl mx-auto">
		<div class="text-center mb-16">
			<h2 class="text-4xl md:text-5xl font-bold text-foreground mb-4">
				사용법은 간단합니다
			</h2>
			<p class="text-lg md:text-xl text-muted-foreground">
				3단계로 누구나 쉽게 시작할 수 있습니다
			</p>
		</div>

		<div class="space-y-12">
			<!-- Step 1 -->
			<div class="grid md:grid-cols-3 gap-8 items-center">
				<div class="text-center">
					<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary text-primary-foreground text-xl font-bold grid place-items-center">
						1
					</div>
					<h3 class="text-xl font-semibold text-foreground mb-2">회원가입</h3>
					<p class="text-muted-foreground">간단한 정보만 입력하면 시작</p>
				</div>
				<div class="md:col-span-2">
					<Card>
						<CardContent class="p-6">
							<p class="text-muted-foreground">
								기본 정보를 입력하고 프로필을 설정하세요. 
								나만의 닉네임으로 ZZIC 커뮤니티에 참여할 수 있습니다.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>

			<!-- Step 2 -->
			<div class="grid md:grid-cols-3 gap-8 items-center">
				<div class="text-center md:order-3">
					<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary text-secondary-foreground text-xl font-bold grid place-items-center">
						2
					</div>
					<h3 class="text-xl font-semibold text-foreground mb-2">목표 설정</h3>
					<p class="text-muted-foreground">하고 싶은 일들을 추가하세요</p>
				</div>
				<div class="md:col-span-2 md:order-1">
					<Card>
						<CardContent class="p-6">
							<p class="text-muted-foreground">
								작은 목표부터 큰 꿈까지 자유롭게 추가하세요. 
								AI 추천을 받거나 친구들과 함께할 챌린지도 찾아보세요.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>

			<!-- Step 3 -->
			<div class="grid md:grid-cols-3 gap-8 items-center">
				<div class="text-center">
					<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-accent text-accent-foreground text-xl font-bold grid place-items-center">
						3
					</div>
					<h3 class="text-xl font-semibold text-foreground mb-2">완성하기</h3>
					<p class="text-muted-foreground">하나씩 체크하며 성취감을 느끼세요</p>
				</div>
				<div class="md:col-span-2">
					<Card>
						<CardContent class="p-6">
							<p class="text-muted-foreground">
								매일 조금씩 체크해보세요. 친구들과 응원도 주고받고, 
								완료할 때마다 성취감을 느낄 수 있습니다.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	</div>
</section>
