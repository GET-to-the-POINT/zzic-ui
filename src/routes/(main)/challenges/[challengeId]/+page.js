/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	// 더미 데이터 - 나중에 실제 API 호출로 대체
	const challenge = {
		id: params.challengeId,
		title: '매일 3개 할 일 완료하기',
		description:
			'하루에 최소 3개의 할 일을 완료하여 꾸준한 생산성을 유지하세요. 작은 습관이 큰 변화를 만듭니다!',
		type: 'daily',
		status: 'active',
		startDate: '2024-12-01',
		endDate: '2024-12-31',
		createdBy: '챌린지마스터',
		participants: 156,
		completionRate: 78,
		myProgress: {
			joined: true,
			currentStreak: 5,
			bestStreak: 8,
			totalCompleted: 45,
			todayCompleted: 2,
			todayGoal: 3
		},
		rules: [
			'매일 자정까지 3개의 할 일을 완료해야 합니다',
			'완료한 할 일은 챌린지 카테고리에 속해야 합니다',
			'하루라도 목표를 달성하지 못하면 스트릭이 초기화됩니다'
		],
		rewards: {
			completion: '500 XP + 꾸준함의 달인 뱃지',
			milestones: [
				{ days: 7, reward: '100 XP' },
				{ days: 14, reward: '200 XP + 2주 달성 뱃지' },
				{ days: 30, reward: '500 XP + 월간 챔피언 뱃지' }
			]
		},
		leaderboard: [
			{ rank: 1, name: '열정킹', streak: 28, completed: 84 },
			{ rank: 2, name: '도전왕', streak: 25, completed: 75 },
			{ rank: 3, name: '꾸준함', streak: 22, completed: 66 },
			{ rank: 15, name: '나', streak: 5, completed: 45, isMe: true }
		],
		recentActivity: [
			{ user: '열정킹', action: '3개 할 일 완료', time: '방금 전' },
			{ user: '도전왕', action: '7일 연속 달성!', time: '10분 전' },
			{ user: '새싹이', action: '챌린지 참여', time: '1시간 전' }
		]
	};

	return {
		meta: {
			title: `${challenge.title} - 챌린지`,
			description: challenge.description
		},
		challenge
	};
}
