import { error } from '@sveltejs/kit';
import DeleteTodoContextMenu from './DeleteContextMenu.svelte';

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
    const { todoId } = params;
    const { zzic } = await parent();

    const { data, error: todoError } = await zzic.todo.getTodo({ todoId });

    if (todoError) {
        error(500, todoError.detail);
    }

    return {
        meta: {
            title: data.title,
            description: '할일 수정 페이지입니다.',
            modal: true
        },
        todo: data,
        formId: crypto.randomUUID(),
        contextMenu: DeleteTodoContextMenu,
    };
}
