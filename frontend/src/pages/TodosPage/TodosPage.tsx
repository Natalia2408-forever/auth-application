import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import { AuthContext } from '../../components/AuthContext';
import { FILTERS, useTodos, type Filter } from '../../hooks/useTodos';
import styles from './TodosPage.module.scss';

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: FILTERS.all, label: 'All' },
  { value: FILTERS.active, label: 'Active' },
  { value: FILTERS.completed, label: 'Completed' },
];

export const TodosPage = () => {
  const { user } = useContext(AuthContext);
  const {
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
  } = useTodos(user);

  const [errorMessage, setErrorMessage] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [prevTitleError, setPrevTitleError] = useState(titleError);

  if (titleError !== prevTitleError) {
    setPrevTitleError(titleError);

    if (!titleError) {
      setErrorVisible(false);
    } else {
      setErrorMessage(titleError);
    }
  }

  useEffect(() => {
    if (!titleError) {
      return;
    }

    const id = requestAnimationFrame(() => setErrorVisible(true));

    return () => cancelAnimationFrame(id);
  }, [titleError]);

  return (
    <div className={styles.page}>
      <div className={styles.leafDecor} aria-hidden="true" />

      <AppHeader />
      <div className={styles.wrapper}>
        <h2 className={styles.title}>My tasks</h2>
        <div className={styles.card}>
          <form className={styles.header} onSubmit={handleAddTodo}>
            {todos.length > 0 && (
              <button
                type="button"
                aria-label="Mark all as complete"
                aria-pressed={todos.every(todo => todo.completed)}
                className={`${styles.toggleAll} ${todos.every(todo => todo.completed) ? styles.toggleAllActive : ''}`}
                onClick={handleToggleAll}
              />
            )}

            <label htmlFor="new-todo" className={styles.visuallyHidden}>
              New task text
            </label>
            <input
              id="new-todo"
              name="todo"
              type="text"
              className={styles.newTodo}
              placeholder="What needs to be done?"
              value={title}
              autoComplete="off"
              onChange={event => setTitle(event.target.value)}
            />
            <button
              type="submit"
              className={`${styles.addBtn} ${!title.trim() ? styles.addBtnDisabled : ''}`}
              aria-disabled={!title.trim()}
            >
              Add
            </button>
          </form>

          {errorMessage && (
            <p
              className={`${styles.titleError} ${errorVisible ? styles.titleErrorVisible : ''}`}
              onTransitionEnd={() => {
                if (!errorVisible) {
                  setErrorMessage('');
                }
              }}
            >
              <svg
                className={styles.titleErrorIcon}
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M10 6v5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="13.5" r="1" fill="currentColor" />
              </svg>
              {errorMessage}
            </p>
          )}

          {todos.length > 0 && (
            <ul className={styles.list}>
              {visibleTodos.map(todo => (
                <li
                  key={todo.id}
                  className={`${styles.item} ${todo.completed ? styles.itemCompleted : ''}`}
                >
                  <label
                    className={styles.statusLabel}
                    htmlFor={`todo-${todo.id}`}
                  >
                    <input
                      id={`todo-${todo.id}`}
                      type="checkbox"
                      className={styles.statusInput}
                      checked={todo.completed}
                      onChange={() => handleToggle(todo.id)}
                    />
                    <span
                      className={`${styles.statusCircle} ${todo.completed ? styles.statusCircleChecked : ''}`}
                    >
                      {todo.completed && (
                        <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
                      )}
                    </span>
                    <span className={styles.visuallyHidden}>
                      Mark "{todo.title}" as complete
                    </span>
                  </label>
                  <span className={styles.itemTitle}>{todo.title}</span>
                  <button
                    type="button"
                    aria-label={`Delete «${todo.title}»`}
                    className={styles.remove}
                    onClick={() => handleRemove(todo.id)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          {todos.length === 0 && (
            <p className={styles.empty}>No tasks yet. Add your first one!</p>
          )}

          {todos.length > 0 && (
            <div className={styles.footer}>
              <span className={styles.count}>
                {activeCount} {activeCount === 1 ? 'task' : 'tasks'} left
              </span>

              <div
                className={styles.filters}
                role="group"
                aria-label="Task filter"
              >
                {FILTER_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={filter === option.value}
                    className={`${styles.filterLink} ${filter === option.value ? styles.filterSelected : ''}`}
                    onClick={() => setFilter(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className={styles.clearCompleted}
                onClick={handleClearCompleted}
                disabled={completedCount === 0}
              >
                Clear completed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
