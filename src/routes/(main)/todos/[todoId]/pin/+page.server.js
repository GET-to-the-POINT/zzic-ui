import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ locals: { zzic }, params }) => {
		const { todoId } = params;
		
		// todoId가 'id:daysDifference' 형식인지 확인
		const parts = todoId.split(':');
		const actualTodoId = parts[0];
		const daysDifference = parts.length > 1 ? parseInt(parts[1]) : undefined;
		
		const { error } = await zzic.todo.togglePin({ todoId: actualTodoId, daysDifference });

		if (error) {
			return fail(400, { error: error.message || 'Todo 핀 처리 실패' });
		}

		return { success: true };
	}
};