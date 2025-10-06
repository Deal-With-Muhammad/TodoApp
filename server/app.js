// server/app.js
const express = require("express");
const cors = require("cors");
const todosRoutes = require("./routes/todos.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // replaces body-parser for JSON

// Mount resource routes
app.use("/todos", todosRoutes);

// (Optional) health check
app.get("/health", (req, res) => res.json({ ok: true }));

// Centralized error handler: map domain errors → HTTP responses
app.use((err, req, res, next) => {
  if (err?.message === "TEXT_REQUIRED") {
    return res.status(422).json({ message: "Text is required." });
  }
  if (err?.message === "TEXT_TOO_LONG") {
    return res.status(422).json({ message: "Text too long (max 100)." });
  }
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

module.exports = app;
