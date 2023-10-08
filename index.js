const express = require("express");
const port = 3000;

const app = express();

app.get("/", function (req, res) {
  res.send("<h1>hello</h1>");
});

app.listen(port, function (err) {
  if (err) {
    console.log("Error in connecting server");
  }

  console.log("Server is running in port ", port);
});
