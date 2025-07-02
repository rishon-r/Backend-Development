import express from 'express';
import db from '../db.js';

const router= express.Router();

// Get all to-do's for logged in user
router.get('/', (req,res) => {
  const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?');
  const todos = getTodos.all(req.userId);
  res.json(todos);

});

// Create a new to-do
router.post('/', (req,res) => {
  const { task } = req.body;
  const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`);
  const result = insertTodo.run(req.userId, task);

  res.json({ id: result.lastInsertRowid, task, completed: 0 });

});

// Update a to-do
// :id is called a dynamic route parameter
// The colon : means Express treats id as a variable placeholder in the URL.
// In Express, a variable placeholder is a part of your route path that acts like a slot for a dynamic value in the URL.
router.put('/:id', (req,res) => {
  const { completed } = req.body
  const { id } = req.params
  const { page } = req.query

  const updatedTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?')
  updatedTodo.run(completed, id)

  res.json({ message: "Todo completed" })

});

// Delete a to-do
// What we are doing here is technically called a hard delete
// This is not the industry standard as once we delete this information it is gone
// In the industry, we usually use something known as soft delete
// Here, deleted information is usually still available, it's just not on display for the user
router.delete('/:id', (req,res) => {
  const { id } = req.params
  const userId = req.userId
  const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`)
  deleteTodo.run(id, userId)
  
  res.send({ message: "Todo deleted" })

});

export default router;