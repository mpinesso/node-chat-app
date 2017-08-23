// librerie di node
const path = require('path');

// librerie esterne
const express = require('express');

// costanti
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT;

// variabili
var app = express();

// configurazione del server
  // indica dove sono situati i file statici (html, img, ...)
app.use(express.static(publicPath));


// configura la porta del server
app.listen(port, () =>{
  console.log(`Started on port ${port}`);
})
