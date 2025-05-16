// GET /api/todos/123
export async function GET({ params }) {
	const { id } = params;
	const todo = { id, title: 'Demo title', done: false };
	return new Response(JSON.stringify(todo));
}

// DELETE /api/todos/123
export async function DELETE({ params }) {
	const { id } = params;
	// 삭제 처리 로직
	return new Response(null, { status: 204 });
}