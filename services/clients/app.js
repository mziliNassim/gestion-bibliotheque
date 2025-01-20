const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

const dbConnetion = require("../../config/db");

const app = express();

app.use(express.json());
dotenv.config();

// Routes
app.get("/clients", async (req, res) => {
  try {
    const db = await dbConnetion();
    const clinets = await db.collection("Clients").find().toArray();

    if (clinets.length === 0)
      return res.status(200).json({ message: "No Client found", data: [] });
    return res.status(200).json({ message: "All Clients", data: clinets });
  } catch (error) {
    console.log("getClinets ~ error:", error.message);
    return res
      .status(500)
      .json({ message: "Failled to get clients.", data: null });
  }
});

app.get("/clients/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const db = await dbConnetion();
    const client = await db
      .collection("Clients")
      .findOne({ _id: new ObjectId(id) });

    if (!client)
      return res
        .status(404)
        .json({ message: "Client non trouvé.", data: null });

    res.status(200).json({
      message: `Clinet with id : ${id}`,
      data: { ...client, password: undefined },
    });
  } catch (error) {
    console.log("getClinetById ~ error:", error.message);
    res.status(500).json({ message: "Failled to get client.", data: null });
  }
});

app.post("/clients", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("addClinet ~ email:", email);
    // Validation
    if (!username || !email || !password)
      return res
        .status(400)
        .json({ message: "Tous les champs sont requis.", data: null });

    const db = await dbConnetion();

    // is username taken
    const usernameExist = await db.collection("Clients").findOne({ username });
    if (usernameExist)
      return res.status(400).json({ message: "Invalid username.", data: null });

    // is email taken
    const emailExist = await db.collection("Clients").findOne({ email });
    if (emailExist)
      return res.status(400).json({ message: "Invalid Email.", data: null });

    // nouvel client
    const newClient = {
      ...req.body,
      password: await bcrypt.hash(password, 10),
    };

    // Inserstion to DB
    const result = await db.collection("Clients").insertOne(newClient);

    return res.status(201).json({
      message: "Client ajouté avec succès.",
      data: {
        ...(await db.collection("Clients").findOne({ _id: result.insertedId })),
        password: undefined,
      },
    });
  } catch (error) {
    console.log("addClinet ~ error:", error.message);
    return res.status(500).json({ message: "Failled to add client." });
  }
});

app.put("/clients/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { username, email, password } = req.body;

    // 1 min update
    if (!username && !email && !password)
      return res
        .status(400)
        .json({ message: "Aucun champ à mettre à jour.", data: null });

    const db = await dbConnetion();

    // is username valid
    if (username && username.length > 3) {
      const usernameExist = await db
        .collection("Clients")
        .findOne({ username });

      if (usernameExist)
        return res
          .status(400)
          .json({ message: "Invalid username", data: null });
    }

    // is Email valid
    if (email) {
      const emailExist = await db.collection("Clients").findOne({ email });

      if (emailExist)
        return res.status(400).json({ message: "Invalid Email", data: null });
    }

    // hash password
    let updatedClinet = req.body;
    if (password) updatedClinet.password = await bcrypt.hash(password, 10);

    // Mettre à jour le client dans la base de données
    const result = await db
      .collection("Clients")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedClinet });

    if (result.matchedCount === 0)
      return res
        .status(404)
        .json({ message: "Client non trouvé.", data: null });

    return res.status(200).json({
      message: "Client mis à jour avec succès.",
      data: {
        ...(await db.collection("Clients").findOne({ _id: new ObjectId(id) })),
        password: undefined,
      },
    });
  } catch (error) {
    console.log("updateClinetById ~ error:", error.message);
    res.status(500).json({ message: "Failled to update client." });
  }
});

app.delete("/clients/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const db = await dbConnetion();
    const result = await db
      .collection("Clients")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Client not found.", data: null });

    res.status(200).json({
      message: `Clinet deleted successfuly`,
      data: null,
    });
  } catch (error) {
    console.log("getClinetById ~ error:", error.message);
    res.status(500).json({ message: "Failled to delete client.", data: null });
  }
});

// Server Listening
const port = process.env.CLINETS_PORT || 5000;
app.listen(port, () => {
  console.log(`server "Clinets" on http://localhost:${port}/`);
});
