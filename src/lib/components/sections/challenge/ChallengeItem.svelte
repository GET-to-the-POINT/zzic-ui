<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Users from '@lucide/svelte/icons/users';
	import Calendar from '@lucide/svelte/icons/calendar';

	/**
	 * @typedef {Object} Challenge
	 * @property {number} id - 챌린지 ID
	 * @property {string} title - 챌린지 제목
	 * @property {string} description - 챌린지 설명
	 * @property {string} category - 카테고리
	 * @property {number} participantCount - 전체 참여자 수
	 * @property {number} duration - 기간(일)
	 * @property {boolean} joined - 내가 참여했는지 여부
	 */

	/**
	 * @typedef {Object} Props
	 * @property {Challenge} challenge - 챌린지 정보
	 * @property {Object} [formData] - 서버에서 받은 폼 데이터 (선택적)
	 * @property {Function} [onJoin] - 참여 콜백 함수 (선택적)
	 */

	/** @type {Props} */
	const { challenge, formData, onJoin } = $props();
	
	// 다이얼로그 상태 관리
	let dialogOpen = $state(false);
	
	const handleJoinClick = () => {
		if (!challenge.joined) {
			dialogOpen = true;
		}
	};
	
	const handleDialogClose = () => {
		dialogOpen = false;
		// 참여 성공 시 콜백 호출
		if (onJoin) {
			onJoin(challenge.id);
		}
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{challenge.title}</Card.Title>
		<Card.Description>
			<Badge variant="secondary">{challenge.category}</Badge>
		</Card.Description>
	</Card.Header>
	
	<Card.Content>
		<p class="text-sm text-muted-foreground mb-4">{challenge.description}</p>
		<div class="grid grid-cols-2 gap-4 text-sm">
			<div class="flex items-center gap-2">
				<Users class="w-4 h-4 text-muted-foreground" />
				<span class="text-muted-foreground">참여자</span>
				<span class="font-medium">{challenge.participantCount}명</span>
			</div>
			<div class="flex items-center gap-2">
				<Calendar class="w-4 h-4 text-muted-foreground" />
				<span class="text-muted-foreground">기간</span>
				<span class="font-medium">{challenge.duration}일</span>
			</div>
		</div>
	</Card.Content>
	
	<Card.Footer>
		<Button
			class="w-full"
			variant={challenge.joined ? "secondary" : "default"}
			disabled={challenge.joined}
			onclick={handleJoinClick}
		>
			{challenge.joined ? '참여함' : '참여하기'}
		</Button>
	</Card.Footer>
</Card.Root>

<!-- 참여 다이얼로그 -->
<!-- {#if formData}
	<JoinChallengeDialog 
		open={dialogOpen} 
		onOpenChange={handleDialogClose}
		challenge={challenge}
		data={formData}
	/>
{/if} -->
