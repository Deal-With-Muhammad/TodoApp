// src/components/TodoApp.jsx
import { useEffect, useRef, useState } from "react";
import { useTodos } from "../hooks/useTodos";

export default function TodoApp() {
  const { items, status, error, load, add, isPending, dismissError } =
    useTodos();
  const [text, setText] = useState("");
  const didInit = useRef(false); // avoid double fetch in React 18 StrictMode (dev-only)

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    load();
  }, [load]);

  const onSubmit = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    add(t);
    setText("");
  };

  return (
    <div
      style={{
        maxWidth: 560,
        margin: "40px auto",
        fontFamily: "system-ui",
        lineHeight: 1.4,
      }}
    >
      <div
        style={{
          padding: 20,
          border: "1px solid #eee",
          borderRadius: 6,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div>
          <h1 style={{ marginBottom: 16 }}>Optimistic Todos</h1>

          <form
            onSubmit={onSubmit}
            style={{ display: "flex", gap: 8, marginBottom: 12 }}
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write something…"
              style={{
                padding: 10,
                flex: 1,
                border: "1px solid #ccc",
                borderRadius: 6,
              }}
              aria-label="New todo text"
            />
            <button
              type="submit"
              style={{
                padding: "10px 14px",
                borderRadius: 6,
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
              disabled={!text.trim()}
            >
              Add
            </button>
          </form>

          {status === "loading" && <p>Loading…</p>}

          {error && (
            <div
              role="alert"
              style={{
                background: "#ffe6e6",
                border: "1px solid #ffb3b3",
                color: "#a40000",
                padding: "8px 12px",
                borderRadius: 6,
                marginBottom: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{error}</span>
              <button
                onClick={dismissError}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                }}
                aria-label="Dismiss error"
                title="Dismiss"
              >
                ×
              </button>
            </div>
          )}

          <ul style={{ paddingLeft: 18 }}>
            {items.map((t) => (
              <li
                key={t.id}
                style={{
                  opacity: isPending(t.id) ? 0.5 : 1,
                  transition: "opacity 120ms",
                  marginBottom: 6,
                }}
              >
                {t.text} {isPending(t.id) && <em>(saving…)</em>}
              </li>
            ))}
          </ul>

          {items.length === 0 && status === "succeeded" && (
            <p>No todos yet—add one above.</p>
          )}
        </div>
      </div>
    </div>
  );
}
