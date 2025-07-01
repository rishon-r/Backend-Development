// IMPORTING EXPRESS in a different way than the one we used in project 1
// This is the modern and recommended one
import express from 'express';

// Import the default export from the built-in Node.js path module.
// The path module provides utilities for working with file and directory paths (like join, resolve, basename).
// { dirname } → imports the named export dirname, which gives you path.dirname() — a function to get the directory name of a given path
import path, {dirname} from 'path';

// fileURLToPath is a function from Node’s built-in url module.
// It converts a file URL (like import.meta.url) into a native file path your OS understands.
// A file URL is a special kind of URL that represents the location of a file on your computer’s file system, instead of a resource on the web.
// In Node.js (CommonJS), __dirname and __filename are global variables automatically available in every module
// They help you know where your current file is located on the file system.
// __dirname	The absolute path to the directory that contains the current file
// __filename	The absolute path to the file itself
// In ES modules (.mjs or "type": "module" in package.json), you don’t have __dirname or __filename like in CommonJS.
// Instead, you have import.meta.url, which is a file URL. import.meta.url is a built-in ES module feature that gives you the absolute URL of the current module file.
// i.e A file:// URL is just a way to represent a local file’s absolute path in URL format.
// You often convert it back to a normal file path so Node’s fs or path modules can use it.
import {fileURLToPath} from 'url';

// Here, you are importing the default export from ./routes/authRoutes.js
// That default export is an Express Router instance
// i.e We import an Express Router called authRoutes from ./routes/authRoutes.js
// This router file defines all your authentication-related routes
import authRoutes from './routes/authRoutes.js';

// Here, you are importing the default export from ./routes/todoRoutes.js
// That default export is an Express Router instance
// i.e We import an Express Router called todoRoutes from ./routes/todoRoutes.js
// This router file contains all toDo related routes
import todoRoutes from './routes/todoRoutes.js';

// INITIALIZING WEB SERVER INSTANCE
const app=express(); 

const PORT= process.env.PORT || 8080;

// Get the file path from the URL of the current module
const __filename= fileURLToPath(import.meta.url);
// Get the directory name from the file path
const __dirname = dirname(__filename);

// MIDDLEWARE
app.use(express.json());
// This line configures Express to serve static files (HTML, CSS, JS, images, etc.).
// `express.static(...)` is built-in middleware that looks inside the folder you specify 
// and serves files directly to the browser as-is.
// 
// path.join(__dirname, '../public')` safely builds the absolute path to your `public` folder.
//   `__dirname` is the absolute path to the directory of this server file.
//   `'../public'` means "go up one level, then into the public folder".
//   `path.join` makes sure the final path works on any OS (Windows, macOS, Linux).
//
// What this does:
//   - If the browser requests `/style.css`, Express will look for `public/style.css`.
//   - If the file exists, Express sends it back as-is. If not, Express moves on to your other routes.
// In short: This makes everything inside `public/` accessible to the browser without extra routes!
// Serves the HTML file from the /public directory
// Tells express to serve all files from the public folder as static assets / file. Any requests for the css files will be resolved to the public directory
app.use(express.static(path.join(__dirname, '../public')));




// Serving up the HTML file from the /public directory
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Routes
// app.use() is Express’s way of mounting middleware or a router
// It means: “Any incoming request that matches this path prefix will be handled by this middleware.”
// /auth is the path prefix
// Any request that starts with /auth will be routed to authRoutes
// We have previously seen that authRoutes is a router instance
// his keeps your auth logic modular and your server.js file clean and organized!
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

app.listen(PORT,() => {
  console.log(`Server has started on port: ${PORT}`);
});
