
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export const api = {
  async listTodos({ signal } = {}) {
    const res = await fetch(`${BASE}/todos`, { signal });
    if (!res.ok) throw new Error(`Network error (${res.status})`);
    return res.json();
  },

  async createTodo({ text, clientTempId, signal } = {}) {
    const res = await fetch(`${BASE}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, clientTempId }),
      signal,
    });
    // Handle cases where body might be empty on error.
    const data = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(data?.message || `Create failed (${res.status})`);
    return data;
  },
};
