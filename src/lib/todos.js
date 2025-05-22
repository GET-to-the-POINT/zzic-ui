export const getTodos = (done) => `/api/todos?done=${done}`;
export const getTodo = (id) => {
	return {url:`/api/todos/${id}`, options: { method: 'GET' } };
}
export const createTodo = ({title, description}) => {
	return {url:`/api/todos`, options: { method: 'POST', body: JSON.stringify({title, description}), headers: { 'Content-Type': 'application/json' } } };
}
export const updateTodo = (id, {done}) => {
	return {url:`/api/todos/${id}`, options: { method: 'PATCH', body: JSON.stringify({done}), headers: { 'Content-Type': 'application/json' } } };
}
export const deleteTodo = (id) => {
	return {url:`/api/todos/${id}`, options: { method: 'DELETE' } };
}
