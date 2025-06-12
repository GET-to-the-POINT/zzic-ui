<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Users from '@lucide/svelte/icons/users';
	import Calendar from '@lucide/svelte/icons/calendar';

	/**
	 * @typedef {Object} Props
	 * @property {string} title - 챌린지 제목
	 * @property {string} description - 챌린지 설명
	 * @property {Snippet} category - 카테고리 스니펫
	 * @property {number} participantCount - 전체 참여자 수
	 * @property {number} duration - 기간(일)
	 * @property {boolean} joined - 내가 참여했는지 여부
	 * @property {Function} onJoin - 참여 버튼 클릭 핸들러
	 */

	/** @type {Props} */
	const { title, description, category, participantCount, duration, joined, onJoin } = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		<Badge variant="secondary">{@render category()}</Badge>
	</Card.Header>
	<Card.Content>
		<p class="text-sm mb-3">{description}</p>
		<div class="flex items-center justify-between text-xs mb-3">
			<div class="flex items-center gap-1">
				<Users class="w-3 h-3" />
				<span>{participantCount}명</span>
			</div>
			<div class="flex items-center gap-1">
				<Calendar class="w-3 h-3" />
				<span>{duration}일</span>
			</div>
		</div>
		<Button
			size="sm"
			onclick={onJoin}
			class="w-full"
			disabled={joined}
		>
			{joined ? '참여함' : '참여하기'}
		</Button>
	</Card.Content>
</Card.Root>
