<script>
	import * as Card from '$lib/components/ui/card/index.js';
    import * as Form from '$lib/components/ui/form/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Users from '@lucide/svelte/icons/users';
	import Calendar from '@lucide/svelte/icons/calendar';

	/**
	 * @typedef {import('$lib/zzic-api/challenge.js').ChallengeDto} Challenge
	 */

	/**
	 * @typedef {Object} Props
	 * @property {Challenge} challenge - 챌린지 정보
	 * @property {boolean} [isDetail=false] - 디테일 페이지 여부
	 */

	/** @type {Props} */
	const { challenge, isDetail = false } = $props();

	/**
	 * 날짜를 포맷팅
	 * @param {string} dateString - YYYY-MM-DD 형식의 날짜
	 * @returns {string}
	 */
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return `${date.getMonth() + 1}/${date.getDate()}`;
	};

	/**
	 * 시작일과 종료일 사이의 일수를 계산
	 * @param {string} startDate - YYYY-MM-DD 형식의 시작일
	 * @param {string} endDate - YYYY-MM-DD 형식의 종료일
	 * @returns {number}
	 */
	const calculateDays = (startDate, endDate) => {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const diffTime = Math.abs(end - start);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
		return diffDays;
	};
</script>

<Card.Root class="min-w-60 @container max-w-sm">
	<Card.Header>
		<div class="flex items-center justify-between mb-2">
			<Badge variant="outline">{challenge.periodType}</Badge>
			<span class="hidden @xs:block text-sm text-muted-foreground">{formatDate(challenge.startDate)} 시작</span>
		</div>
		<Card.Title class="truncate" title={challenge.title}>{challenge.title}</Card.Title>
		<Card.Description class="hidden @xs:block">
			{challenge.description}
		</Card.Description>
	</Card.Header>
	
	<Card.Content>
		<div class="grid grid-cols-2 gap-4 text-sm">
			<div class="flex flex-col items-center gap-2">
				<Users class="w-4 h-4 text-muted-foreground" />
                <span class="sr-only">참여자 수</span>
				<span class="font-medium">{challenge.participantCount}명</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Calendar class="w-4 h-4 text-muted-foreground" />
				<span class="sr-only">기간</span>
				<span class="font-medium">{calculateDays(challenge.startDate, challenge.endDate)}일간</span>
			</div>
		</div>
	</Card.Content>
	
	<Card.Footer class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Button
            href="/challenges/{challenge.id}"
            variant="outline"
            size="default"
            class="flex-1"
        >
            자세히
        </Button>
        <form action={`/challenges/${challenge.id}?/join`} method="POST" class="flex-1">
            <Form.Button
                name="challengeId"
                value={challenge.id}
                class="w-full"
                variant={challenge.participationStatus ? "secondary" : "default"}
                disabled={challenge.participationStatus}
            >
                {challenge.participationStatus ? '참여함' : '참여하기'}
            </Form.Button>
        </form>
	</Card.Footer>
</Card.Root>
