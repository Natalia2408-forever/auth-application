import { useEffect, useMemo, useState } from 'react';
import { loadTodos, saveTodos } from '../utils/todosStorage.js';

export const FILTERS = { all: 'all', active: 'active', completed: 'completed' };

export function useTodos(user) {
  const [todos, setTodos] = useState(() => loadTodos(user));
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(FILTERS.all);

  useEffect(() => {
    saveTodos(user, todos);
  }, [todos, user]);

  const handleAddTodo = event => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Enter text of a task');
      return;
    }

    setTodos(current => [
      ...current,
      {
        id: Date.now(),
        title: trimmedTitle,
        completed: false,
      },
    ]);
    setTitle('');
    setError('');
  };

  const handleToggle = id => {
    setTodos(current =>
      current.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    setTodos(current =>
      current.map(todo => ({ ...todo, completed: !allCompleted })),
    );
  };

  const handleRemove = id => {
    setTodos(current => current.filter(todo => todo.id !== id));
  };

  const handleClearCompleted = () => {
    setTodos(current => current.filter(todo => !todo.completed));
  };

  const activeCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const completedCount = todos.length - activeCount;

  const visibleTodos = useMemo(
    () =>
      todos.filter(todo => {
        if (filter === FILTERS.active) {
          return !todo.completed;
        }

        if (filter === FILTERS.completed) {
          return todo.completed;
        }

        return true;
      }),
    [todos, filter],
  );

  return {
    todos,
    visibleTodos,
    title,
    setTitle,
    error,
    setError,
    filter,
    setFilter,
    activeCount,
    completedCount,
    handleAddTodo,
    handleToggle,
    handleToggleAll,
    handleRemove,
    handleClearCompleted,
  };
}
