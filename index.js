const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 3000 || process.env.PORT;

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());




app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
