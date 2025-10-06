// src/hooks/useTodos.js
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  createTodoOptimistic,
  createTodo,
  fetchTodos,
  clearError,
} from "../features/todosSlice";

export function useTodos() {
  const dispatch = useDispatch();

  const items = useSelector((s) => s.todos.items);
  const pending = useSelector((s) => s.todos.pending);
  const status = useSelector((s) => s.todos.status);
  const error = useSelector((s) => s.todos.error);

  // Memoize to play nice with StrictMode and effect deps
  const load = useCallback(() => {
    return dispatch(fetchTodos());
  }, [dispatch]);

  const add = useCallback(
    (text) => {
      const optimistic = createTodoOptimistic(text);
      const { tempId } = optimistic.payload;
      dispatch(optimistic); // optimistic row
      dispatch(createTodo({ tempId, text })); // real server call
    },
    [dispatch]
  );

  const isPending = useCallback((id) => !!pending[id], [pending]);
  const dismissError = useCallback(() => dispatch(clearError()), [dispatch]);

  return { items, status, error, load, add, isPending, dismissError };
}
