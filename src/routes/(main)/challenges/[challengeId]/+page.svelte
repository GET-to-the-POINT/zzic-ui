<script>
	import { enhance } from '$app/forms';
	import * as Form from '$lib/components/ui/form/index.js';
	
	/** @type {import('./$types').PageData} */
	const { data } = $props();
	
</script>

<svelte:head>
	<title>{data.challenge.title} - ZZIC</title>
	<meta name="description" content={data.challenge.description} />
</svelte:head>

<div class="container mx-auto py-8 px-4">
	<div class="max-w-2xl mx-auto">
		
		<div class="space-y-6">
			<!-- 챌린지 상세 정보 -->
			<div class="bg-card rounded-lg border p-6">
				<div class="flex justify-between items-start mb-4">
					<div>
						<h1 class="text-2xl font-bold mb-2">{data.challenge.title}</h1>
						<p class="text-muted-foreground mb-4">{data.challenge.description}</p>
					</div>
					<div class="text-right">
						<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
							{data.challenge.category}
						</span>
					</div>
				</div>
				
				<div class="grid grid-cols-3 gap-4 mb-6 text-sm">
					<div>
						<span class="text-muted-foreground">기간</span>
						<p class="font-medium">{data.challenge.duration || '미정'}일</p>
					</div>
					<div>
						<span class="text-muted-foreground">참여자</span>
						<p class="font-medium">{data.challenge.participantCount || 0}명</p>
					</div>
					<div>
						<span class="text-muted-foreground">상태</span>
						<p class="font-medium">
							{#if data.challenge.participationStatus === true}
								참여 중
							{:else}
								미참여
							{/if}
						</p>
					</div>
				</div>
				
				<!-- 참여/탈퇴 버튼 -->
				<div class="flex gap-2">
					{#if data.challenge.participationStatus === true}
						<form method="POST" action="?/leave">
							<Form.Button 
								type="submit"
								variant="ghost-warning"
							>
								중도 하차
							</Form.Button>
						</form>
					{:else}
						<form method="POST" action="?/join">
							<Form.Button 
								type="submit" 
							>
								참여
							</Form.Button>
						</form>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
