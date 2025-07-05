<script>
	import DraggableBox from '$lib/components/ui/test/DraggableBox.svelte';
	import DroppableZone from '$lib/components/ui/test/DroppableZone.svelte';

	// 사용 가능한 아이템들
	let availableItems = $state([
		{
			id: 'item1',
			content: '<h4 class="font-bold">📝 메모</h4><p class="text-sm mt-1">중요한 메모입니다</p>'
		},
		{
			id: 'item2',
			content: '<h4 class="font-bold">📅 일정</h4><p class="text-sm mt-1">오늘의 일정</p>'
		},
		{
			id: 'item3',
			content: '<h4 class="font-bold">✅ 할 일</h4><p class="text-sm mt-1">완료해야 할 작업</p>'
		},
		{
			id: 'item4',
			content: '<h4 class="font-bold">💡 아이디어</h4><p class="text-sm mt-1">새로운 아이디어</p>'
		},
		{
			id: 'item5',
			content: '<h4 class="font-bold">🎯 목표</h4><p class="text-sm mt-1">이번 달 목표</p>'
		}
	]);

	// 각 존의 아이템들
	let zone1Items = $state([]);
	let zone2Items = $state([]);
	let zone3Items = $state([]);
</script>

<main>
	<div class="container mx-auto p-8">
		<h1 class="h1 mb-8">드래그 앤 드롭 컴포넌트 테스트</h1>

		<!-- 사용 가능한 아이템들 -->
		<section class="mb-8">
			<h2 class="h2 mb-4">사용 가능한 아이템</h2>
			<p class="text-surface-600-300 mb-4">아래 아이템들을 드래그해서 원하는 존에 놓으세요</p>

			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
				{#each availableItems as item (item.id)}
					<DraggableBox
						id={item.id}
						content={item.content}
						class="preset-filled-primary-50-950"
						onRemove={() => {}}
					/>
				{/each}
			</div>
		</section>

		<!-- 드롭 존들 -->
		<section>
			<h2 class="h2 mb-4">드롭 존</h2>
			<div class="grid md:grid-cols-3 gap-6">
				<DroppableZone
					title="📥 받은 편지함"
					items={zone1Items}
					onItemsChange={(items) => (zone1Items = items)}
				/>

				<DroppableZone
					title="🔥 진행 중"
					items={zone2Items}
					onItemsChange={(items) => (zone2Items = items)}
				/>

				<DroppableZone
					title="✅ 완료됨"
					items={zone3Items}
					onItemsChange={(items) => (zone3Items = items)}
				/>
			</div>
		</section>

		<!-- 사용법 -->
		<section class="mt-8 card p-6">
			<h3 class="h3 mb-4">주요 기능</h3>
			<ul class="list-disc list-inside space-y-2">
				<li>
					<strong>드래그 시작</strong>: 아이템을 클릭하고 드래그하면 원래 위치에 점선 테두리가
					표시됩니다
				</li>
				<li>
					<strong>마우스 따라다니기</strong>: 드래그 중인 아이템은 마우스 커서를 따라 움직입니다
				</li>
				<li><strong>드롭 가능 영역</strong>: 드롭 존에 가져가면 하이라이트됩니다</li>
				<li><strong>아이템 삭제</strong>: 각 아이템의 X 버튼으로 삭제할 수 있습니다</li>
				<li><strong>중복 방지</strong>: 같은 아이템은 한 존에 하나만 존재할 수 있습니다</li>
			</ul>

			<div class="mt-6 grid md:grid-cols-3 gap-4">
				<div class="card preset-filled-surface-200-800 p-4">
					<h4 class="font-bold mb-2">Zone 1 아이템 수</h4>
					<p class="text-2xl font-mono">{zone1Items.length}</p>
				</div>
				<div class="card preset-filled-surface-200-800 p-4">
					<h4 class="font-bold mb-2">Zone 2 아이템 수</h4>
					<p class="text-2xl font-mono">{zone2Items.length}</p>
				</div>
				<div class="card preset-filled-surface-200-800 p-4">
					<h4 class="font-bold mb-2">Zone 3 아이템 수</h4>
					<p class="text-2xl font-mono">{zone3Items.length}</p>
				</div>
			</div>
		</section>
	</div>
</main>
