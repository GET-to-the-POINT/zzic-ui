<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Plus from '@lucide/svelte/icons/plus';
	import ChallengeItem from './ChallengeItem.svelte';

	/**
	 * @typedef {Object} Challenge
	 * @property {string} id - 챌린지 ID
	 * @property {string} title - 챌린지 제목
	 * @property {string} description - 챌린지 설명
	 * @property {string} category - 챌린지 카테고리
	 * @property {number} participantCount - 참여자 수
	 * @property {number} duration - 기간 (일)
	 * @property {any[]} tasks - 태스크 목록
	 * @property {boolean} isActive - 활성 상태
	 */

	/**
	 * @typedef {Object} Props
	 * @property {Challenge[]} challenges - 챌린지 목록
	 * @property {Function} onViewMore - 전체보기 클릭 핸들러
	 * @property {Function} onJoinChallenge - 챌린지 참여 클릭 핸들러
	 */

	/** @type {Props} */
	const { challenges, onViewMore, onJoinChallenge } = $props();

	// 최대 4개까지만 표시
	const displayChallenges = $derived(challenges.slice(0, 4));
</script>

<Card.Root class="">
	<Card.Header class="">
			<Card.Title class="">추천 챌린지</Card.Title>
			<Button 
				variant="ghost" 
				size="sm" 
				onclick={onViewMore}
				class=""
				disabled={false}
			>
				전체보기
			</Button>
	</Card.Header>
	<Card.Content class="@container">
		<div class="grid grid-cols-1 @[400px]:grid-cols-2 gap-4">
			{#each displayChallenges as challenge (challenge.id)}
				<ChallengeItem 
					{challenge} 
					onJoin={onJoinChallenge} 
				/>
			{/each}
		</div>
		
		{#if challenges.length === 0}
			<div class="text-center py-8">
				<div class="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
					<Plus class="w-6 h-6" />
				</div>
				<p class="text-muted-foreground text-sm">아직 참여 가능한 챌린지가 없습니다</p>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
