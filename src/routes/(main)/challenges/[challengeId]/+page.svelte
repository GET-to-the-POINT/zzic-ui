<script>
	import { enhance } from '$app/forms';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	
	const { data } = $props();
</script>

<div class="container mx-auto py-8 px-4">
	<Card.Root>
		<Card.Header>
			<div>
				<Card.Title class="text-2xl">{data.challenge.title}</Card.Title>
				<Card.Description>{data.challenge.description}</Card.Description>
			</div>
		</Card.Header>
		
		<Card.Content class="space-y-6">
			<div class="grid grid-cols-3 gap-4 text-sm">
				<div>
					<span class="text-muted-foreground">기간</span>
					<p class="font-medium">{data.challenge.duration}일</p>
				</div>
				<div>
					<span class="text-muted-foreground">참여자</span>
					<p class="font-medium">{data.challenge.participantCount}명</p>
				</div>
			</div>
			

		</Card.Content>

		<Card.Footer>
			<!-- 참여/탈퇴 버튼 -->
			<form method="POST" action="?/enroll" use:enhance>
				<Form.Button 
					name="enroll"
					value={data.challenge.participationStatus}
					variant={data.challenge.participationStatus ? "ghost-warning" : "default"}
				>
					{#if data.challenge.participationStatus}
						중도 포기
					{:else}
						참여하기
					{/if}
				</Form.Button>
			</form>
		</Card.Footer>
	</Card.Root>
</div>
