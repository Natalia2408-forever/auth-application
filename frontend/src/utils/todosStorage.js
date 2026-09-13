function getStorageKey(user) {
  return `todos_${user?.id ?? 'guest'}`;
}

export function loadTodos(user) {
  try {
    const raw = localStorage.getItem(getStorageKey(user));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTodos(user, todos) {
  localStorage.setItem(getStorageKey(user), JSON.stringify(todos));
}
