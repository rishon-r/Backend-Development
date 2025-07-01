// Below line imports the named export DatabaseSync from the node:sqlite module
// node:sqlite is an SQLite library for Node.js
// DatabaseSync is a class that provides a synchronous (blocking) API for working with an SQLite database.
// So DatabaseSync lets you open a database file, run queries, create tables, insert data — all using synchronous method
import { DatabaseSync } from 'node:sqlite';
// new DatabaseSync(...) creates a new SQLite database connection.
// The argument ':memory:' is a special SQLite filename that means: “Don’t create an actual file — create a temporary database in RAM.”
const db = new DatabaseSync(':memory:');
// Execute SQL statements from strings
// We create two tables here: One to handle users and one to handle the to-do Tasks
// We associate every to-do Task in the task table with a user

db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )

`);

db.exec(`
    CREATE TABLE todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      task TEXT,
      completed BOOLEAN DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id)
  )
  
`);

export default db;
  

