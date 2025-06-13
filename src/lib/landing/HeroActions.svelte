<script>
	import * as Button from '$lib/components/ui/button/index';
	import * as Dialog from '$lib/components/ui/dialog';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import Plus from '@lucide/svelte/icons/plus';
	import Wrench from '@lucide/svelte/icons/wrench';
	import { page } from '$app/state';

	let dialogOpen = $state(false);

	const closeDialog = () => {
		dialogOpen = false;
	};
</script>

<div class="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
	<Button.Root href="/dashboard" size="lg" class="gap-2">
		<CheckCircle2 size={20} />
		일정관리 시작하기
	</Button.Root>

	<Button.Root
		href={`/todos`}
		size="lg"
		class="gap-2"
	>
		<Plus size={20} />
		Todo 보기
	</Button.Root>
	
	<Dialog.Root bind:open={dialogOpen}>
		<Dialog.Trigger class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
			<Plus size={20} />
			기능 둘러보기
		</Dialog.Trigger>
		
		<Dialog.Content class="max-w-md">
			<Dialog.Header class="text-center">
				<div class="mx-auto mb-4 w-16 h-16 bg-muted rounded-full grid place-items-center">
					<Wrench size={32} class="text-muted-foreground" />
				</div>
				<Dialog.Title class="text-xl font-semibold">
					공사중입니다
				</Dialog.Title>
				<Dialog.Description class="text-muted-foreground">
					죄송합니다. 
					<br />이 기능은 현재 개발 중에 있어요.
					<br />조금만 기다려주시면 곧 만나보실 수 있습니다!
				</Dialog.Description>
			</Dialog.Header>
			
			<Dialog.Footer>
				<Button onclick={closeDialog}>
					확인
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>
