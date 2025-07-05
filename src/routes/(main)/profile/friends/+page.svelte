<script>
	import User from '@lucide/svelte/icons/user';
	import Users from '@lucide/svelte/icons/users';
	import UserPlus from '@lucide/svelte/icons/user-plus';
	import Search from '@lucide/svelte/icons/search';
	import Copy from '@lucide/svelte/icons/copy';
	import MoreVertical from '@lucide/svelte/icons/more-vertical';
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import { toaster } from '$lib/utils/toast';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const { data } = $props();

	// Tab navigation based on route
	const tabs = [
		{ path: '/profile', label: '내 정보', icon: User },
		{ path: '/profile/friends', label: '친구', icon: Users }
	];

	// Friends sub-tab state
	let friendsSubTab = $state('list');
	const friendsSubTabs = [
		{ id: 'list', label: '친구 목록' },
		{ id: 'add', label: '친구 추가' },
		{ id: 'invite', label: '친구 초대' },
		{ id: 'requests', label: '받은 요청' }
	];

	// Friends state
	let searchQuery = $state('');
	let searchResults = $state([]);
	let isSearching = $state(false);
	let inviteCode = $state('');
	let isGeneratingInvite = $state(false);

	// Friends data
	const friends = data.friends || [];
	const friendRequests = data.friendRequests || [];

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('ko-KR');
	}

	// Friend functions
	async function searchFriends() {
		if (!searchQuery.trim()) return;

		isSearching = true;
		try {
			// TODO: API 호출
			await new Promise((resolve) => setTimeout(resolve, 1000));
			searchResults = [
				{ id: 1, nickname: '김철수', email: 'kim@example.com', level: 5, levelName: '중급자' },
				{ id: 2, nickname: '이영희', email: 'lee@example.com', level: 3, levelName: '초급자' }
			];
		} finally {
			isSearching = false;
		}
	}

	async function generateInviteCode() {
		isGeneratingInvite = true;
		try {
			// TODO: API 호출
			await new Promise((resolve) => setTimeout(resolve, 1000));
			inviteCode = 'ZZIC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
			toaster.success({ title: '초대 코드가 생성되었습니다!' });
		} finally {
			isGeneratingInvite = false;
		}
	}

	function copyInviteCode() {
		navigator.clipboard.writeText(inviteCode);
		toaster.success({ title: '초대 코드가 복사되었습니다!' });
	}

	async function sendFriendRequest(memberId) {
		// TODO: API 호출
		toaster.success({ title: '친구 요청을 보냈습니다!' });
		searchResults = searchResults.filter((r) => r.id !== memberId);
	}

	async function acceptFriendRequest(requestId) {
		// TODO: API 호출
		toaster.success({ title: '친구 요청을 수락했습니다!' });
	}

	async function rejectFriendRequest(requestId) {
		// TODO: API 호출
		toaster.success({ title: '친구 요청을 거절했습니다!' });
	}

	async function removeFriend(friendId) {
		// TODO: API 호출
		toaster.success({ title: '친구를 삭제했습니다!' });
	}

	async function blockFriend(friendId) {
		// TODO: API 호출
		toaster.success({ title: '친구를 차단했습니다!' });
	}
</script>

<!-- Friends Sub-tabs -->
<section class="card preset-filled-surface-50-950 p-4 flex gap-2 overflow-x-auto">
	{#each friendsSubTabs as subTab}
		<button
			class="btn {friendsSubTab === subTab.id ? 'preset-filled-primary-500' : 'hover:preset-tonal'}"
			onclick={() => (friendsSubTab = subTab.id)}
		>
			{subTab.label}
			{#if subTab.id === 'requests' && friendRequests.length > 0}
				{friendRequests.length}
			{/if}
		</button>
	{/each}
</section>

<!-- Friends Content -->
{#if friendsSubTab === 'list'}
	<!-- 친구 목록 -->
	<section class="card preset-filled-surface-50-950 p-6 space-y-4">
		<h2 class="text-lg font-semibold">친구 목록 ({friends.length}명)</h2>

		{#if friends.length === 0}
			<div class="text-center py-8 text-surface-600-300">
				<Users size={48} class="mx-auto mb-4 opacity-50" />
				<p>아직 친구가 없습니다.</p>
				<p class="text-sm mt-2">친구를 추가하거나 초대해보세요!</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each friends as friend}
					<div
						class="flex items-center justify-between p-4 rounded-lg preset-filled-surface-50-950"
					>
						<div class="flex items-center gap-3">
							<div
								class="w-12 h-12 rounded-full preset-filled-primary-500 flex items-center justify-center"
							>
								{#if friend.profilePictureUrl}
									<img
										src={friend.profilePictureUrl}
										alt={friend.nickname}
										class="w-full h-full rounded-full object-cover"
									/>
								{:else}
									<User size={20} class="text-white" />
								{/if}
							</div>
							<div>
								<div class="font-semibold">{friend.nickname}</div>
								<div class="text-sm text-surface-600-300">
									레벨 {friend.level} • {friend.levelName}
								</div>
							</div>
						</div>

						<button class="p-2 rounded-lg hover:preset-filled-surface-200-700">
							<MoreVertical size={20} />
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</section>
{:else if friendsSubTab === 'add'}
	<!-- 친구 추가 -->
	<section class="card preset-filled-surface-50-950 p-6 space-y-4">
		<h2 class="text-lg font-semibold">친구 검색</h2>

		<div class="flex gap-2">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="닉네임 또는 이메일로 검색"
				class="input preset-outlined flex-1"
				onkeydown={(e) => e.key === 'Enter' && searchFriends()}
			/>
			<button class="btn preset-filled-primary-500" onclick={searchFriends} disabled={isSearching}>
				<Search size={16} />
				검색
			</button>
		</div>

		{#if isSearching}
			<div class="text-center py-8">
				<div
					class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto"
				></div>
				<p class="mt-4 text-surface-600-300">검색 중...</p>
			</div>
		{:else if searchResults.length > 0}
			<div class="space-y-3">
				{#each searchResults as result}
					<div
						class="flex items-center justify-between p-4 rounded-lg preset-filled-surface-50-950"
					>
						<div class="flex items-center gap-3">
							<div
								class="w-12 h-12 rounded-full preset-filled-surface-300-600 flex items-center justify-center"
							>
								<User size={20} />
							</div>
							<div>
								<div class="font-semibold">{result.nickname}</div>
								<div class="text-sm text-surface-600-300">
									{result.email} • 레벨 {result.level}
								</div>
							</div>
						</div>

						<button
							class="btn btn-sm preset-filled-primary-500"
							onclick={() => sendFriendRequest(result.id)}
						>
							<UserPlus size={16} />
							친구 추가
						</button>
					</div>
				{/each}
			</div>
		{:else if searchQuery}
			<div class="text-center py-8 text-surface-600-300">
				<Search size={48} class="mx-auto mb-4 opacity-50" />
				<p>검색 결과가 없습니다.</p>
			</div>
		{/if}
	</section>
{:else if friendsSubTab === 'invite'}
	<!-- 친구 초대 -->
	<section class="card preset-filled-surface-50-950 p-6 space-y-4">
		<h2 class="text-lg font-semibold">친구 초대</h2>

		<div class="space-y-4">
			<p class="text-surface-600-300">
				초대 코드를 생성하여 친구에게 공유하세요. 친구가 코드를 입력하면 자동으로 친구가 됩니다.
			</p>

			{#if inviteCode}
				<div class="card preset-filled-primary-50-950 p-4">
					<div class="flex items-center justify-between">
						<div>
							<div class="text-sm text-surface-600-300 mb-1">초대 코드</div>
							<div class="text-2xl font-mono font-bold">{inviteCode}</div>
						</div>
						<button class="btn preset-filled-primary-500" onclick={copyInviteCode}>
							<Copy size={16} />
							복사
						</button>
					</div>
				</div>
			{/if}

			<button
				class="btn preset-filled-primary-500 w-full"
				onclick={generateInviteCode}
				disabled={isGeneratingInvite}
			>
				{#if isGeneratingInvite}
					<div
						class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
					></div>
				{:else}
					<UserPlus size={16} />
				{/if}
				초대 코드 생성
			</button>
		</div>
	</section>
{:else if friendsSubTab === 'requests'}
	<!-- 받은 요청 -->
	<section class="card preset-filled-surface-50-950 p-6 space-y-4">
		<h2 class="text-lg font-semibold">받은 친구 요청 ({friendRequests.length}개)</h2>

		{#if friendRequests.length === 0}
			<div class="text-center py-8 text-surface-600-300">
				<UserPlus size={48} class="mx-auto mb-4 opacity-50" />
				<p>받은 친구 요청이 없습니다.</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each friendRequests as request}
					<div
						class="flex items-center justify-between p-4 rounded-lg preset-filled-surface-50-950"
					>
						<div class="flex items-center gap-3">
							<div
								class="w-12 h-12 rounded-full preset-filled-surface-300-600 flex items-center justify-center"
							>
								{#if request.fromProfilePictureUrl}
									<img
										src={request.fromProfilePictureUrl}
										alt={request.fromNickname}
										class="w-full h-full rounded-full object-cover"
									/>
								{:else}
									<User size={20} />
								{/if}
							</div>
							<div>
								<div class="font-semibold">{request.fromNickname}</div>
								{#if request.message}
									<div class="text-sm text-surface-600-300">{request.message}</div>
								{/if}
								<div class="text-xs text-surface-500">{formatDate(request.createdAt)}</div>
							</div>
						</div>

						<div class="flex gap-2">
							<button
								class="btn btn-sm preset-filled-success-500"
								onclick={() => acceptFriendRequest(request.id)}
							>
								<Check size={16} />
								수락
							</button>
							<button
								class="btn btn-sm preset-filled-surface-300-600"
								onclick={() => rejectFriendRequest(request.id)}
							>
								<X size={16} />
								거절
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
{/if}
