// server/controllers/todos.controller.js
// HTTP boundary only: parse req, call service, map domain errors to HTTP via next(err).
const svc = require("../todos.service");

async function listTodos(req, res, next) {
  try {
    const todos = await svc.listTodos();
    res.json(todos);
  } catch (err) {
    next(err);
  }
}

async function createTodo(req, res, next) {
  try {
    const { text /*, clientTempId */ } = req.body;
    const saved = await svc.createTodo({ text });
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
}

module.exports = { listTodos, createTodo };
