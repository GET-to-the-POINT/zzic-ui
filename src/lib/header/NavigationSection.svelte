<script>
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import LogOut from '@lucide/svelte/icons/log-out';
	import LogIn from '@lucide/svelte/icons/log-in';
	import Palette from '@lucide/svelte/icons/palette';
	import Settings from '@lucide/svelte/icons/settings';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
  import * as Form from '$lib/components/ui/form/index.js';
  import { superForm } from 'sveltekit-superforms';

  const { user } = $props();
	
  let logiedState = $state(false);

  const { form, enhance: enhanceSignOut, submitting } = superForm({}, {
    onResult: ({ result }) => {
      if (result.type === 'success' || result.type === 'redirect') {
        logiedState = false;
      }
    }
  });
</script>

{#if !user}
    <Button
        variant="outline"
        href="/auth/sign-in"
        >
        <LogIn size={16} />
        <span class="hidden sm:inline">사인-인</span>
    </Button>
{:else}
    <Dialog.Root bind:open={logiedState}>
        <Dialog.Trigger>
            <Avatar.Root class="inline-block">
                <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
                <Avatar.Fallback>CN</Avatar.Fallback>
            </Avatar.Root>
        </Dialog.Trigger>
        <Dialog.Content>
            <Dialog.Header>
                <Dialog.Title>메뉴</Dialog.Title>
                <Dialog.Description>어떤 작업을 수행하시겠습니까?</Dialog.Description>
            </Dialog.Header>

            <form method="POST" action="/auth/sign-out" use:enhanceSignOut>
                <Form.Button type="submit" variant="outline" class="w-full" disabled={$submitting}>
                    {#if $submitting}
                        <LoaderCircle size={18} class="animate-spin" />
                        사인-아웃 중...
                    {:else}
                        <LogOut size={18} />
                        사인-아웃
                    {/if}
                </Form.Button>
            </form>
            <Button
                href="/my-page"
                variant="outline"
               
                disabled={false}
            >
                <Settings size={18} />
                마이페이지
            </Button>
            <Button
                href="/theme"
                variant="outline"
                disabled={false}
            >
                <Palette size={18} />
                테마 선택
            </Button>
        </Dialog.Content>
    </Dialog.Root>
{/if}
