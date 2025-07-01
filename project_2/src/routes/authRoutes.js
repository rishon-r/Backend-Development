import express from 'express';
import bcrypt from 'bcrypt.js';
import jwt from 'jsonwebtoken'; 
import db from '../db.js';

// express.Router() is a function provided by Express
// It creates a “mini Express app” that you can attach routes and middleware to.
// You then mount that mini app onto your main app with app.use()
const router= express.Router();

// Register a new user endpoing /auth/register
router.post('/register', (req, res) => {
  

})

router.post('/login', (req, res) => {
 
})

// default export is an Express Router instance here
export default router;