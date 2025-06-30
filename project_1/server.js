// INITIALIZING A SERVER
// The below line of code requires the express package
// any line of code within the express package is now assigned to this variable
// it essentially imports express into our file
const express= require('express'); 

// DEFINING OUR BACK-END APPLICATION
// below line of code invokes express as a function
const app=express();

// We define a port below that we want the server to listen for network requests from 
const PORT="8383"


// The below line of code is usually placed at the bottom of the code file
// It essentially allows the server to listen for incoming request
// It takes first argument, the PORT on which it should listen from
// The second argument it takes is a callback function
app.listen(PORT, () => {
  console.log(`Server has started on :${PORT}`)
}); 
