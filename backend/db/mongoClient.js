const { MongoClient } = require("mongodb");
require("dotenv").config();

let client;

async function connectDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    console.log("✅ MongoDB connected");
  }
  return client.db(process.env.DB_NAME);
}

module.exports = connectDB;
