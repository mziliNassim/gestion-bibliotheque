const express = require("express");
const dotenv = require("dotenv");

const dbConnection = require("../../config/db");

const app = express();

app.use(express.json());
dotenv.config();

// Routes
app.get("/notifications", async (req, res) => {
  try {
    const db = await dbConnection();
    const result = await db.collection("notifications").find().toArray();
    res.status(200).json({ message: "Notifications", data: result });
  } catch (err) {
    console.log("app.get ~ notifications ~ err:", err);
    res.status(500).json({ message: err.message });
  }
});

// Server Listening
const port = process.env.NOTIFICATIONS_PORT || 5005;
app.listen(port, () => {
  console.log(`server "Notifications" on http://localhost:${port}/`);
});
