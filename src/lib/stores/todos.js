import { writable } from 'svelte/store';

/**
 * @typedef {Object} Todo
 * @property {number} id - 고유 식별자
 * @property {string} title - 할 일 제목
 * @property {string} description - 상세 설명
 * @property {boolean} done - 완료 여부
 */

/** @type {Todo[]} */
const initialTodos = [
  { id: 1, title: '할 일 1', description: '더미 설명 1', done: false },
  { id: 2, title: '할 일 2', description: '더미 설명 2', done: true },
  { id: 3, title: '할 일 3', description: '더미 설명 3', done: false }
];

/** @type {import('svelte/store').Writable<Todo[]>} */
export const todos = writable(initialTodos);

/**
 * 할 일 추가 헬퍼
 * @param {Todo} todo
 */
export function addTodo(todo) {
  todos.update(list => [...list, todo]);
}

/**
 * 완료 상태 토글 헬퍼
 * @param {number} id - 토글할 할 일의 id
 */
export function toggleTodo(id) {
  todos.update(list =>
    list.map(t => t.id === id ? { ...t, done: !t.done } : t)
  );
}