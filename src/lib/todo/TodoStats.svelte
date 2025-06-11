<script>
	import * as Card from "$lib/components/ui/card/index.js";

	/**
	 * @typedef {Object} Todo
	 * @property {string} id - Todo ID
	 * @property {string} title - Todo 제목
	 * @property {boolean} done - 완료 여부
	 */

	/**
	 * @typedef {Object} Props
	 * @property {number} yetTotalElements - 미완료 Todo 개수
	 * @property {number} doneTotalElements - 완료된 Todo 개수
	 */

	/** @type {Props} */
	const { yetTotalElements = 0, doneTotalElements = 0 } = $props();

	// 통계 계산
	let totalTodos = $derived(yetTotalElements + doneTotalElements);
	let progressTodos = $derived(yetTotalElements);
	let completedTodos = $derived(doneTotalElements);
</script>

<Card.Card>
	<Card.CardHeader>
		<Card.CardTitle>통계</Card.CardTitle>
	</Card.CardHeader>
	<Card.CardContent>
		<dl class="grid grid-cols-3 gap-4 text-center">
			<div class="space-y-2">
				<dt class="text-sm font-medium">전체</dt>
				<dd class="text-2xl font-bold">{totalTodos}</dd>
			</div>
			
			<div class="space-y-2">
				<dt class="text-sm font-medium">진행</dt>
				<dd class="text-2xl font-bold">{progressTodos}</dd>
			</div>
			
			<div class="space-y-2">
				<dt class="text-sm font-medium">완성</dt>
				<dd class="text-2xl font-bold">{completedTodos}</dd>
			</div>
		</dl>
	</Card.CardContent>
</Card.Card>
