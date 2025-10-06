// server/todos.service.js
// Business rules & orchestration live here.
const { nextId } = require("./db");
const repo = require("./todos.repo");

// Domain validation: text required, <= 100 chars
function validate(text) {
  if (!text || !text.trim()) throw new Error("TEXT_REQUIRED");
  if (text.length > 100) throw new Error("TEXT_TOO_LONG");
}

async function listTodos() {
  return repo.findAll();
}

async function createTodo({ text /*, clientRequestId (optional) */ }) {
  validate(text);
  const now = new Date().toISOString();
  const todo = { id: nextId(), text, createdAt: now, version: 1 };
  return repo.insert(todo);
}

module.exports = { listTodos, createTodo };
