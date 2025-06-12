<script>
	import ChallengeItem from '$lib/components/sections/challenge/ChallengeItem.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	
	/** @type {import('./$types').PageData} */
	const { data } = $props();
	
	// 페이지 로드 시 URL 파라미터 확인
	onMount(() => {
		const url = new URL($page.url);
		const joined = url.searchParams.get('joined');
		const left = url.searchParams.get('left');
		
		if (joined === 'true') {
			// 성공적으로 참여함을 알리는 토스트나 알림 표시
			console.log('챌린지 참여가 완료되었습니다!');
		} else if (left === 'true') {
			// 성공적으로 탈퇴함을 알리는 토스트나 알림 표시
			console.log('챌린지에서 탈퇴했습니다.');
		}
	});
	
	const handleJoin = (challengeId) => {
		// 참여 완료 후 페이지 새로고침 또는 상태 업데이트
		window.location.reload();
	};
</script>

<svelte:head>
	<title>{data.challenge.title} - ZZIC</title>
	<meta name="description" content={data.challenge.description} />
</svelte:head>

<div class="container mx-auto py-8 px-4">
	<div class="max-w-2xl mx-auto">
		<div class="mb-6">
			<a href="/challenges" class="text-sm text-muted-foreground hover:text-foreground">
				← 챌린지 목록으로 돌아가기
			</a>
		</div>
		
		<div class="space-y-6">
			<!-- 챌린지 상세 정보 -->
			<ChallengeItem 
				challenge={data.challenge}
				formData={data.joinForm}
				onJoin={handleJoin}
			/>
			
			<!-- 추가 정보 섹션 -->
			<div class="bg-muted/50 rounded-lg p-6">
				<h3 class="text-lg font-semibold mb-4">챌린지 정보</h3>
				<div class="space-y-4">
					<div>
						<h4 class="font-medium text-sm text-muted-foreground mb-1">설명</h4>
						<p class="text-sm">{data.challenge.description}</p>
					</div>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<h4 class="font-medium text-sm text-muted-foreground mb-1">카테고리</h4>
							<p class="text-sm">{data.challenge.category}</p>
						</div>
						<div>
							<h4 class="font-medium text-sm text-muted-foreground mb-1">기간</h4>
							<p class="text-sm">{data.challenge.duration}일</p>
						</div>
					</div>
					<div>
						<h4 class="font-medium text-sm text-muted-foreground mb-1">현재 참여자</h4>
						<p class="text-sm">{data.challenge.participantCount}명이 참여 중</p>
					</div>
				</div>
			</div>
			
			<!-- 챌린지 규칙 -->
			<div class="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6">
				<h3 class="text-lg font-semibold mb-4">챌린지 규칙</h3>
				<ul class="space-y-2 text-sm text-muted-foreground">
					<li>• 매일 성실히 참여해주세요</li>
					<li>• 다른 참여자들을 응원해주세요</li>
					<li>• 포기하지 말고 끝까지 완주해보세요</li>
					<li>• 건강한 경쟁 문화를 만들어가요</li>
				</ul>
			</div>
		</div>
	</div>
</div>
