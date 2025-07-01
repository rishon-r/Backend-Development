// INITIALIZING A SERVER
// The below line of code requires the express package
// any line of code within the express package is now assigned to this variable
// it essentially imports express into our file
const express= require('express'); // BASICALLY AN IMPORT STATEMENT

// DEFINING OUR BACK-END APPLICATION
// below line of code invokes express as a function
// The function returns an instance of an Express application — basically, an object with lots of helpful methods
// Some of these methods are: app.get(), app.post(), app.listen(), app.use()
// This app object is your web server instance, and it’s what you use to define routes, middleware, error handlers, etc
const app=express();

// We define a port below that we want the server to listen for network requests from 
// The address of this server connected to the network is: 
// URL -> http://localhost:8383
// IP -> 127.0.0.1:8383
const PORT="8383";

// The below array is simply used to store dummy data for this application

let data = ['james']

// Middleware
// app.use is a method in Express that mounts middleware on your application.
// Middleware is just a fancy term for functions that run during the request-response cycle.
// Middleware can: Inspect or modify the request (req) or response (res) objects, Run extra logic (like authentication, logging, or parsing), End the request-response cycle OR pass control to the next middleware.
// This line registers middleware that lets your Express app automatically parse incoming JSON payloads in the body of HTTP requests.
// When a client sends you a request with a JSON body (like {"name": "Alice"}) — Express doesn’t know how to read it by default.
// express.json() is built-in middleware that reads the raw request body, parses the JSON, and attaches it to req.body.
app.use(express.json());


// ENDPOINTS- HTTP VERBS (or methods) AND ROUTES (or paths)
// The method informs the nature of the equest and the route is a further subdirectory
// Basically, we direct the request to the appropriate body of code that responds to the request in the desired manner
// These locations or routes are called ENDPOINTS

// Type 1 - Website endpoints (these endpoints are for sending back html and they typically come when a user enters a url in a browser)
// An endpoint that returns HTML (or full pages) to be rendered visually in a browser.
// Used when users navigate to a URL and expect to see a web page.


// app.get() is a method provided by the Express application instance (app).
// It defines a route handler for HTTP GET requests to a specific URL path.
// A route handler is a function in a web framework (like Express) that responds to a client’s request for a specific route (URL path + HTTP method).
// i.e When your server receives a GET request (like when you visit a page in your browser), app.get() tells Express how to handle it — what logic to run, and what response to send back.
// It takes two arguments.
// First argument: path → the URL path you want to handle (e.g., '/' or '/about').
// Second argument: callback → the function that runs when a request hits that route. This function gets two arguments:
// 1. req (the incoming request object)
// 2. res (the outgoing response object)
// The callback is called a route handler — it controls what response to send
app.get('/', (req,res) => {
  // This is endpoint number 1: /
  // i.e / is the route of the endpoint
  console.log('User requested the home page website');
    res.send(`
        <body style="background:pink;color: blue;">
        <h1>DATA:</h1>
            <p>${JSON.stringify(data)}</p>
            <a href="/dashboard">Dashboard</a>
        </body>
        <script>console.log('This is my script')</script>
        `);
});

app.get('/dashboard', (req,res) => {
  // This is endpoint number 2: /dashboard
  // i.e /dashboard is the route of the endpoint
  res.send(`
    <body>
    <h1>dashboard</h1>
    <a href="/">home</a>
    </body>
    
    
    `)
});

// Type 2 - API endpoints (non visual)

// CRUD-method create-post read-get update-put and delete-delete
// An endpoint that returns raw data (like JSON) for programs or client-side code to consume.
// Used by JavaScript, mobile apps, or other servers to read or update data programmatically.

app.get('/api/data', (req, res) => {
  console.log('This one was for data');
  res.status(599).send(data);
})

app.post('/api/data', (req, res) => {
  // someone wants to create a user (for example when they click a sign up button)
  // the user clicks the sign up button after entering their credentials, and their browser is wired up to send out a network request to the server to handle that action
  const newEntry = req.body;
  console.log(newEntry);
  data.push(newEntry.name);
  res.sendStatus(201); // This method allows us to send a status code
})

app.delete('/api/data', (req, res) => {
  data.pop();
  console.log('We deleted the element off the end of the array');
  res.sendStatus(203);
});


// The below line of code is usually placed at the bottom of the code file
// It essentially allows the server to listen for incoming request
// It takes first argument, the PORT on which it should listen from
// The second argument it takes is a callback function
app.listen(PORT, () => {
  console.log(`Server has started on: ${PORT}`);
}); 
