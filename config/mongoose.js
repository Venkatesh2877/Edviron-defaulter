const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = "mongodb+srv://assignment:edviron@cluster0.ebxruu8.mongodb.net/";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    console.log("Connect to mongodb");
  } catch (err) {
    console.log(err);
  }
}
run();

module.exports = client;
