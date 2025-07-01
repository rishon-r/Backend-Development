// IMPORTING EXPRESS in a different way than the one we used in project 1
// This is the modern and recommended one
import express from 'express'

// INITIALIZING WEB SERVER INSTANCE
const app=express(); 

const PORT= process.env.PORT || 8080;

app.listen(PORT,() => {
  console.log(`Server has started on port: ${PORT}`);
})