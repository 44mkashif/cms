const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

const corsOptions = {
    exposedHeaders: 'x-auth-token',
};
  
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));

// app.get('/express_backend', (req, res) => {
//   res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
// });
require("./app/routes")(app);

module.exports = app;