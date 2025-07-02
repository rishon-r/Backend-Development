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

});

// Update a to-do
// :id is called a dynamic route parameter
// The colon : means Express treats id as a variable placeholder in the URL.
// In Express, a variable placeholder is a part of your route path that acts like a slot for a dynamic value in the URL.
router.put('/:id', (req,res) => {

});

// Delete a to-do
router.delete('/:id', (req,res) => {

});

export default router;