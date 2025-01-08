const { MongoClient } = require("mongodb");

let db;

const dbConnection = async () => {
  try {
    if (!db) {
      const mongoClient = new MongoClient(process.env.MONGODB_URI);
      const client = await mongoClient.connect();
      db = client.db("OFPPT"); // Assign to the cached variable
      console.log("Connected to MongoDB successfully");
    }
    return db; // Return the cached database instance
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Ensure errors are propagated
  }
};

module.exports = dbConnection;
