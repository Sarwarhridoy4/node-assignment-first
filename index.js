const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 3000 || process.env.PORT;

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

//all api here

//get random user

app.get('/user/random', (req, res) => {
    fs.readFile('./users.json', 'utf8', (err, data) => {
      if (err) throw err;
      const users = JSON.parse(data);
      const randomIndex = Math.floor(Math.random() * users.length);
      res.send(users[randomIndex]);
    });
});
  



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
