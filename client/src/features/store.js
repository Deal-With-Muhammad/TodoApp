// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import todos from "./todosSlice";

export const store = configureStore({
  reducer: { todos },
  devTools: true,
});
