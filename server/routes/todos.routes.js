// server/routes/todos.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/todos.controller");

// GET /todos
router.get("/", ctrl.listTodos);

// POST /todos
router.post("/", ctrl.createTodo);

module.exports = router;
