// Import the Express framework to create routes and handle HTTP requests
import express from 'express';

// Import bcryptjs library to securely hash (encrypt) user passwords
import bcrypt from 'bcryptjs';

// Import jsonwebtoken library to create signed tokens for authentication
import jwt from 'jsonwebtoken';

// Import your custom database connection or query helper from the local db.js file
import db from '../db.js';

// Create a new router instance using Express.
// A router is like a “mini Express app” that you can attach routes and middleware to.
// You’ll later connect this router to your main app with app.use('/auth', authRoutes)
const router = express.Router();

// ROUTE: POST /auth/register
// This endpoint handles user registration.

// When a POST request is made to /register...
router.post('/register', (req, res) => {
  // Extract 'username' and 'password' from the incoming JSON request body
  // We don't have to use JSON.parse() here as we have equipped our middleware to read JSON in server.js
  const { username, password } = req.body;

  // Encrypt the user's password using bcrypt with a salt round of 8.
  // This generates a secure, irreversible hash that gets stored instead of the plain password.
  // In hashing, a salt is a random string that is added to the password before hashing.
  // This ensures that even if two people have the same password, their hashes will be different because they have different salts.
  // Most people use 10–12 in production, but 8 is OK for smaller apps or testing.
  // bcrypt.hashSync() is a synchronous function provided by the bcrypt (or bcryptjs) library in Node.js in order to securely hash plain text passwords
  // Its syntax is of this form: bcrypt.hashSync(password, saltRounds);
  const hashedPassword = bcrypt.hashSync(password, 8);

  // Save the new user and hashed password to the database
  // When interacting with the database, it always makes sense to use a try and catch
  // as the dtabase might sometimes throw unwarranted errors
  // and we obviously don't want these unwanted errors crashing our system
  try {
    // Prepare an SQL statement to insert the new user into the 'users' table
    // In libraries like better-sqlite3, db.prepare() is used to create a reusable prepared statement
    // This does two things:
    // 1. Compiles the SQL query once and caches it in memory.
    // 2. Allows you to run that same query multiple times efficiently, just changing the values.
    // We use ? to represent placeholders
    // For the above reasons, it is preferred over simply using db.execute
    const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`);

    // Execute the SQL statement with the provided username and hashed password
    // .run() executes the prepared statement with the values you provide.
    // .run() substitutes the placeholders (?) with your values safely.
    // It does not return rows — because commands like INSERT don’t have rows to return
    // Instead, it returns an info object about what happened
    const result = insertUser.run(username, hashedPassword);

    // Add a default “starter” to-do item for the new user
    const defaultTodo = `Hello :) Add your first todo!`;

    // Prepare an SQL statement to insert the new to-do linked to the user_id
    const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`);

    // Execute the SQL statement with the new user's ID and default task
    // result.lastInsertRowid gives you the ID of the newly created user — so you can link the to-do to the correct user.
    // .lastInsertRowid is a property of the info object returned to result
    insertTodo.run(result.lastInsertRowid, defaultTodo);

    // Generate a signed JSON Web Token (JWT) for the new user.
    // It includes the user’s ID and expires in 24 hours.
    // jwt.sign() comes from the jsonwebtoken library
    // Syntax: jwt.sign(payload, secretOrPrivateKey, [options, callback])
    // Its job is to create a cryptographically signed token that:
    // 1. Encodes some data (called the payload)
    // 2. Is signed with a secret key
    // 3. Can expire after a set time
    // This token is then sent to the client (browser or mobile app) so the client can include it in future requests to prove “I’m authenticated!”
    const token = jwt.sign(
      { id: result.lastInsertRowid },           // Payload with user ID
      process.env.JWT_SECRET,                   // Secret key from environment variable: only the server knows this
      { expiresIn: '24h' }                      // Options: Token expiration time
    );

    // Send the token back to the client as a JSON response
    res.json({ token });

  } catch (err) {
    // If there’s any error (e.g., duplicate username), log the error and send a 503 Service Unavailable status
    console.log(err.message);
    res.sendStatus(503);
  }
});


// ROUTE: POST /auth/login
// This endpoint will handle user login (currently empty).

router.post('/login', (req, res) => {
   // we get their email, and we look up the password associated with that email in the database
    // but we get it back and see it's encrypted, which means that we cannot compare it to the one the user just used trying to login
    // so what we can to do, is again, one way encrypt the password the user just entered

    const { username, password } = req.body

    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?')
        const user = getUser.get(username)

        // if we cannot find a user associated with that username, return out from the function
        if (!user) { return res.status(404).send({ message: "User not found" }) }

        const passwordIsValid = bcrypt.compareSync(password, user.password)
        // if the password does not match, return out of the function
        if (!passwordIsValid) { return res.status(401).send({ message: "Invalid password" }) }
        console.log(user)

        // then we have a successful authentication
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
  
});

// Export the router so it can be mounted in your main server file
export default router;