<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	
	let { data } = $props();
	let { form } = $derived(data);

	// updateForm은 초기 폼 데이터를 사용
	const updateForm = superForm(form, {
		onResult: async ({ result }) => {
			if (result.type === 'success' || result.type === 'redirect') {
				// 성공 처리
			}
		}
	});

	// deleteForm 생성
	const deleteFormInstance = superForm(form, {
		onResult: async ({ result }) => {
			if (result.type === 'success' || result.type === 'redirect') {
				deleteDialogOpen = false;
			}
		}
	});

	// 각 폼에서 필요한 값들을 분리해서 가져오기
	const { form: updateFormData, enhance: updateEnhance } = updateForm;
	const { enhance: deleteEnhance } = deleteFormInstance;

	let deleteDialogOpen = $state(false);
</script>

<main class={['container mx-auto', 'px-4 py-8', 'space-y-6']}>

<form method="POST" action="?/update" use:updateEnhance class="space-y-4">

	<Form.Field form={updateForm} name="title" class="space-y-2">
	<Form.Control>
			{#snippet children({ props })}
				<Form.Label>제목</Form.Label>
				<Input
					{...props}
					type="text"
					placeholder="제목을 입력하세요"
					bind:value={$updateFormData.title}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field form={updateForm} name="description" class="space-y-2">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>설명</Form.Label>
				<Textarea
					{...props}
					placeholder="설명을 입력하세요 (선택)"
					rows={3}
					bind:value={$updateFormData.description}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button class="w-full">
		수정하기
	</Form.Button>
</form>


	<div class={['flex gap-2 justify-end']}>
		<Dialog.Root bind:open={deleteDialogOpen}>
			<Dialog.Trigger>
				<Button variant="destructive">
					지우기
				</Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>정말 지우시겠습니까?</Dialog.Title>
					<Dialog.Description>
						이 작업은 되돌릴 수 없습니다.
					</Dialog.Description>
				</Dialog.Header>
				<form method="POST" action="?/delete" use:deleteEnhance>
					<Dialog.Footer>
						<Form.Button variant="destructive">
							정말 지우기
						</Form.Button>
					</Dialog.Footer>
				</form>
			</Dialog.Content>
		</Dialog.Root>
		<form method="POST" action="?/update" use:enhance>
			<input type="hidden" name="done" value={!$updateFormData.done} />
			<Form.Button
				variant="outline"
			>
				{#if $updateFormData.done}
					<span>취소하기</span>
				{:else}
					<span>완료하기</span>
				{/if}
			</Form.Button>
		</form>
	</div>
</main>
