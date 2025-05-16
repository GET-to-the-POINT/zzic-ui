export const API_BASE_URL = 'http://localhost:8080';

export const getTodos = (done) => `${API_BASE_URL}/api/todos?done=${done}`;
export const getTodo = (id) => {
	return {url:`${API_BASE_URL}/api/todos/${id}`, options: { method: 'GET' } };
}
export const createTodo = ({title, description}) => {
	return {url:`${API_BASE_URL}/api/todos`, options: { method: 'POST', body: JSON.stringify({title, description}), headers: { 'Content-Type': 'application/json' } } };
}
export const deleteTodo = (id) => {
	return {url:`${API_BASE_URL}/api/todos/${id}`, options: { method: 'DELETE' } };
}

