// src/features/todosSlice.js
import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import { api } from "../api/api";

// Load all todos
export const fetchTodos = createAsyncThunk(
  "todos/fetch",
  async (_, thunkAPI) => {
    try {
      return await api.listTodos({ signal: thunkAPI.signal });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to load todos");
    }
  }
);

// Server create; we reconcile this with the optimistic row
export const createTodo = createAsyncThunk(
  "todos/create",
  async ({ tempId, text }, thunkAPI) => {
    try {
      const saved = await api.createTodo({
        text,
        clientTempId: tempId,
        signal: thunkAPI.signal,
      });
      return { tempId, saved };
    } catch (err) {
      return thunkAPI.rejectWithValue({
        tempId,
        message: err.message || "Create failed",
      });
    }
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState: { items: [], pending: {}, status: "idle", error: null },
  reducers: {
    // Optimistic insert: add a temporary row
    createTodoOptimistic: {
      reducer(state, { payload }) {
        const { tempId, text } = payload;
        state.items.push({ id: tempId, text, __pending: true });
        state.pending[tempId] = true;
      },
      prepare(text) {
        const tempId = `tmp_${nanoid()}`;
        return { payload: { tempId, text } };
      },
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.items = payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Create (reconcile success)
      .addCase(createTodo.fulfilled, (state, { payload }) => {
        const { tempId, saved } = payload;
        const i = state.items.findIndex((t) => t.id === tempId);
        if (i !== -1) {
          state.items[i] = { ...saved, __pending: false };
        } else {
          // If we somehow missed the optimistic row, just add the server row.
          state.items.push({ ...saved, __pending: false });
        }
        delete state.pending[tempId];
      })

      // Create failed → rollback optimistic row & surface error
      .addCase(createTodo.rejected, (state, action) => {
        const tempId = action.payload?.tempId ?? action.meta.arg?.tempId;
        const i = state.items.findIndex((t) => t.id === tempId);
        if (i !== -1) state.items.splice(i, 1);
        delete state.pending[tempId];
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { createTodoOptimistic, clearError } = todosSlice.actions;
export default todosSlice.reducer;
