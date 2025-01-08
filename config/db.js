const { MongoClient } = require("mongodb");

let db;

const dbConnection = async () => {
  try {
    if (!db) {
      const mongoClient = new MongoClient(process.env.MONGODB_URI);
      const client = await mongoClient.connect();
      db = client.db(process.env.DB_NAME);
      console.log("Connected to MongoDB successfully");
    }
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = dbConnection;
