const express = require("express");
const port = 3000;

const app = express();

app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log("Error in connecting server");
  }

  console.log("Server is running in port ", port);
});
