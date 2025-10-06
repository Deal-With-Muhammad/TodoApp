// server/todos.repo.js
// Data access only. No business rules, no HTTP here.
const { todos } = require("./db");

async function insert(todo) {
  todos.push(todo);
  // Return a copy so callers can't mutate stored objects.
  return { ...todo };
}

async function findAll() {
  // Shallow copies for safety
  return todos.map((t) => ({ ...t }));
}

module.exports = { insert, findAll };
