import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

// 폼 스키마 정의
const todoSchema = z.object({
	title: z.string().min(1, '제목을 입력해주세요'),
	description: z.string().optional().nullable(),
	done: z.boolean()
});

// 삭제 폼 스키마 (빈 객체)
const deleteSchema = z.object({});

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
	const { todoId } = params;
	const { zzic } = await parent();

	// @ts-ignore - zzic.todo client is available from parent layout
	const { data: todo, error } = await zzic.todo.getTodo({ todoId });

	if (error || !todo) {
		throw new Error(`Todo with id ${todoId} not found`);
	}

	// superForm을 위한 폼 데이터 생성
	const form = await superValidate(todo, zod(todoSchema));
	const deleteForm = await superValidate({}, zod(deleteSchema));

	return {
		form,
		deleteForm,
		todo,
		title: 'Todo 수정'
	};
}
