const express = require("express");
const dotenv = require("dotenv").config();
const dbConnection = require("../../config/db");
const { ObjectId } = require("mongodb");

const app = express();
app.use(express.json());

// Notification schema: {_id (MongoDB ObjectId), clientID (MongoDB ObjectId), message(str), read(bool), createdAt(date)}

// Get All Notifications
app.get("/notifications", async (req, res) => {
  try {
    const db = await dbConnection();
    const result = await db.collection("Notifications").find().toArray();

    if (result.length === 0)
      return res
        .status(200)
        .json({ message: "No Notifications Found!", data: [] });

    return res.status(200).json({ message: "All Notifications", data: result });
  } catch (err) {
    console.log("app.get ~ err:", err.message);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

// Get notification by ID
app.get("/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await dbConnection();
    const result = await db
      .collection("Notifications")
      .findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res
        .status(404)
        .json({ message: "Notification not found.", data: null });
    }

    return res.status(200).json({ message: "Notification", data: result });
  } catch (err) {
    console.log("app.get ~ err:", err.message);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

// Get all notifications for a client (filter by read/unread) ....url?state="unread" / "read"
app.get("/notifications/client/:clientID", async (req, res) => {
  try {
    const { clientID } = req.params;
    const { state } = req.query; // "read" or "unread"
    const db = await dbConnection();

    let query = { clientID: new ObjectId(clientID) };
    if (state === "read") {
      query.read = true;
    } else if (state === "unread") {
      query.read = false;
    }

    const result = await db.collection("Notifications").find(query).toArray();
    if (result.length === 0)
      return res
        .status(200)
        .json({ message: "No Notifications Found!", data: [] });

    return res.status(200).json({ message: "Notifications", data: result });
  } catch (err) {
    console.log("app.get ~ err:", err.message);
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
});

// Create a new notification -- requred : { clientID, message }
app.post("/notifications", async (req, res) => {
  try {
    const { clientID, message } = req.body;

    if (!clientID || !message) {
      return res.status(400).json({
        message: "clientID and message are required.",
        data: null,
      });
    }

    const db = await dbConnection();
    const newNotification = {
      clientID: new ObjectId(clientID),
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const result = await db
      .collection("Notifications")
      .insertOne(newNotification);

    return res.status(201).json({
      message: "Notification created successfully!",
      data: { _id: result.insertedId, ...newNotification },
    });
  } catch (err) {
    console.log("app.post ~ err:", err.message);
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
});

// Mark notification as read
app.put("/notifications/read/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await dbConnection();

    const result = await db
      .collection("Notifications")
      .updateOne({ _id: new ObjectId(id) }, { $set: { read: true } });

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "Notification not found.", data: null });
    }

    return res.status(200).json({
      message: "Notification marked as read.",
      data: await db
        .collection("Notifications")
        .findOne({ _id: new ObjectId(id) }),
    });
  } catch (err) {
    console.log("app.put ~ err:", err.message);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

// Delete a notification
app.delete("/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await dbConnection();

    const result = await db
      .collection("Notifications")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Notification not found.", data: null });
    }

    return res.status(200).json({
      message: "Notification deleted successfully!",
      data: null,
    });
  } catch (err) {
    console.log("app.delete ~ err:", err.message);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

// Server Listening
const port = process.env.NOTIFICATIONS_PORT || 5005;
app.listen(port, () => {
  console.log(`server "Notifications" on http://localhost:${port}/`);
});
