<script>
  import { page } from '$app/state';
</script>

<form id="create-category-form" method="get" action={page.data.returnTo} class="p-4 space-y-4">
  <input type="text" name="newCategory" placeholder="카테고리 이름" class="input w-full" required />
</form>
