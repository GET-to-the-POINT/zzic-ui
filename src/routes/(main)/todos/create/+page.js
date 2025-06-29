import { error } from '@sveltejs/kit';
import ContextMenu from './CreateContextMenu.svelte';

export async function load({parent}) {

	const { zzic } = await parent();

	const { data: categoryData, error: categoryError } = await zzic.category.getCategories();
	const { data: tagData, error: tagError } = await zzic.tag.getTags();
	const { data: priorityData, error: priorityError } = await zzic.priority.getPriorities();

	if (categoryError) {
		error(500, categoryError.detail);
	} else if (tagError) {
		error(500, tagError.detail);
	} else if (priorityError) {
		error(500, priorityError.detail);
	}

	return {
		meta: {
			title: '할일 생성',
			description: '할일을 생성하는 페이지입니다.',
			modal: true
		},
		formId: crypto.randomUUID(),
		contextMenu: ContextMenu,
		categories: categoryData,
		tags: tagData,
		priorities: priorityData
	};
}
