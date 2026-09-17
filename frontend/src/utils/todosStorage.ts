import type { User, Todo } from '../types/types';

function getStorageKey(user: User | null): string {
  return `todos_${user?.id ?? 'guest'}`;
}

export function loadTodos(user: User | null): Todo[] {
  try {
    const raw = localStorage.getItem(getStorageKey(user));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTodos(user: User | null, todos: Todo[]): void {
  localStorage.setItem(getStorageKey(user), JSON.stringify(todos));
}
