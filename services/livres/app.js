const express = require("express");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const dbConnection = require("../../config/db");

const app = express();
app.use(express.json());

// !Livre nown as : {_id, titre (require), quantite (require), auteur, categorie, isbn, editeur, ....}

// GET All LIvres
app.get("/livres", async (req, res) => {
  try {
    const db = await dbConnection();
    const result = await db.collection("Livres").find().toArray();
    return res.status(200).json({ message: "All Livres", data: result });
  } catch (error) {
    console.log("getLivres ~ error:", error.message);
    return res
      .status(500)
      .json({ message: "Impossible de récupérer les livres", data: null });
  }
});

// GET Livre by ID
app.get("/livres/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const db = await dbConnection();

    const result = await db
      .collection("Livres")
      .findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res
        .status(404)
        .json({ message: `No Livre found with id: ${id}`, data: null });
    }
    return res
      .status(200)
      .json({ message: `Livres pour  id : ${id}`, data: result });
  } catch (error) {
    console.log("getLivresById ~ error:", error.message);
    return res
      .status(500)
      .json({ message: "Impossible de récupérer le liver", data: null });
  }
});

// Create Livre
app.post("/livres", async (req, res) => {
  try {
    // {isbn, titre, auteur, categorie, annee_publication, editeur, langue, tags, description, quantite}
    const { titre, quantite } = req.body;
    if (!titre || !quantite) {
      return res.status(400).json({
        message: "Invalid inputs :  titre* && quantite*",
        data: null,
      });
    }

    const db = await dbConnection();
    const result = await db.collection("Livres").insertOne({ ...req.body });
    return res.status(201).json({
      message: "Livre added successfuly!",
      data: { _id: result.insertedId, ...req.body },
    });
  } catch (err) {
    console.log("addLivre ~ err:", err.message);
    return res.status(500).json({
      message: `Impossible de créer l'élément`,
      data: null,
    });
  }
});

// Update Livre
app.put("/livres/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await dbConnection();
    const result = await db
      .collection("Livres")
      .updateOne({ _id: new ObjectId(id) }, { $set: req.body });

    if (result.matchedCount === 0)
      return res.status(404).json({
        message: "Livre not found.",
        data: null,
      });

    let message;
    if (result.modifiedCount === 0) message = "No changes made to the Livre.";
    else message = "Livre updated successfully!";

    return res.status(200).json({
      message,
      data: await db.collection("Livres").findOne({ _id: new ObjectId(id) }),
    });
  } catch (error) {
    console.log("updateLivre ~ error:", error.message);
    return res.status(500).json({
      message: `Impossible de créer l'élément`,
      data: null,
    });
  }
});

// Delete Livre
app.delete("/livres/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const db = await dbConnection();
    const result = await db
      .collection("Livres")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Livre not found.",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Livre deleted successfully!",
      data: null,
    });
  } catch (error) {
    console.log("deleteLivre ~ error:", error.message);
    return res.status(500).json({
      message: "Impossible de supprimer l'élément.",
      data: null,
    });
  }
});

// Server Listening
const port = process.env.LIVRES_PORT || 5002;
app.listen(port, () => {
  console.log(`server "Livres" on http://localhost:${port}/`);
});
