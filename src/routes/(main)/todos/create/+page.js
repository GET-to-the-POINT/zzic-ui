import ContextMenu from './CreateContextMenu.svelte';

export function load() {
    return {
        meta: {
            title: '할일 생성',
            description: '할일을 생성하는 페이지입니다.',
            modal: true,
        },
        formId: crypto.randomUUID(),
        contextMenu: ContextMenu
    };
}