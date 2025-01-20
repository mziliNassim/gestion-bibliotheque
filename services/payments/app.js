const express = require("express");
const dotenv = require("dotenv");
const { ObjectId } = require("mongodb");

const dbConnection = require("../../config/db");

const app = express();

app.use(express.json());
dotenv.config();

// Routes
app.get("/payments", async (req, res) => {
  try {
    const db = await dbConnection();
    const result = await db.collection("payments").find().toArray();
    res.status(200).json({ message: "payments", data: result });
  } catch (err) {
    console.log("app.get ~ payments ~ err:", err);
    res.status(500).json({ message: err.message });
  }
});

// Server Listening
const port = process.env.PAYMENTS_PORT || 5006;
app.listen(port, () => {
  console.log(`server "Payments" on http://localhost:${port}/`);
});
