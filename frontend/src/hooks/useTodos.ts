import { useEffect, useMemo, useState } from 'react';
import { loadTodos, saveTodos } from '../utils/todosStorage';
import { usePageError } from './usePageError';
import type { User, Todo } from '../types/types';

export const FILTERS = {
  all: 'all',
  active: 'active',
  completed: 'completed',
} as const;
export type Filter = (typeof FILTERS)[keyof typeof FILTERS];

export function useTodos(user: User | null) {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos(user));
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>(FILTERS.all);
  const [titleError, setTitleError] = usePageError('');

  useEffect(() => {
    saveTodos(user, todos);
  }, [todos, user]);

  const handleAddTodo = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setTitleError('Please enter text');

      return;
    }

    setTodos(current => [
      ...current,
      { id: Date.now(), title: trimmedTitle, completed: false },
    ]);

    setTitle('');
  };

  const handleToggle = (id: number) => {
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

  const handleRemove = (id: number) => {
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
    titleError,
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
