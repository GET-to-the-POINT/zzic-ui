<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import ChallengeItem from './ChallengeItem.svelte';
	import * as ScrollArea from "$lib/components/ui/scroll-area/index.js";

	/**
	 * @typedef {import('$lib/zzic-api/challenge.js').ChallengeDto} Challenge
	 */

	/**
	 * @typedef {Object} Props
	 * @property {Challenge[]} challenges - 챌린지 목록
	 * @property {string} [title] - 리스트 제목
	 */

	/** @type {Props} */
	const { 
		challenges, 
		title = "챌린지 목록", 
	} = $props();
</script>

<section class="space-y-6">
	<!-- 헤더 -->
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold">{title}</h2>
        <Button 
            variant="ghost" 
            size="sm" 
            href="/challenges"
        >
            전체보기
        </Button>
	</div>

	{#if challenges.length === 0}
		<div class="text-center py-12">
			<h3 class="text-lg font-medium mb-2">참여 가능한 챌린지가 없습니다</h3>
			<p class="text-muted-foreground text-sm">
				새로운 챌린지를 기다려주세요
			</p>
		</div>
	{:else}
	<ScrollArea.Root orientation="horizontal" class="w-full">
		<div class="flex w-max space-x-4 pb-4">
			{#each challenges as challenge (challenge.id)}
				<ChallengeItem {challenge} />
			{/each}
		</div>
	</ScrollArea.Root>
	{/if}
</section>
