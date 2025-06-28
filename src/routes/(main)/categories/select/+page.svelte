<script>
    const { data } = $props();
</script>

<main class="p-4">
    <form>
        <fieldset>
            <legend class="sr-only">분류 목록</legend>
            <div class="space-y-2">
                {#each data.categories.content as category}
                    <label class="[&:has(input:checked)]:preset-filled-secondary-500 flex items-center gap-3 px-4 h-12 cursor-pointer preset-filled-surface-500">
                        <input
                            type="radio"
                            name="category"
                            class="hidden"
                            value={category.id}
                        />
                        <span class="text-base">{category.name.replace('카테고리', '분류')}</span>
                    </label>
                {/each}
            </div>
        </fieldset>
    </form>
</main>
