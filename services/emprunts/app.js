const express = require("express");
const axios = require("axios");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const dbConnection = require("../../config/db");

const app = express();
app.use(express.json());

// !Emprunt nown as : {_id, livreID, clientID, startDate, returnDate, status : ("en cours" or "returned")}

// get all emprunts
app.get("/emprunts", async (req, res) => {
  try {
    const db = await dbConnection();
    const emprunts = await db.collection("Emprunts").find().toArray();

    if (emprunts.length === 0)
      return res.status(404).json({ message: "No Emprunts found.", data: [] });

    return res
      .status(200)
      .json({ message: "Success, All Emprunts", data: emprunts });
  } catch (error) {
    console.log(" app.get ~ error:", error);
    return res.status(500).json({ message: "Server Error", data: null });
  }
});

// Create Emprunt + Send notification (service Notifcation)
app.post("/emprunts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // check livre disponible
    try {
      const livreResponse = await axios.get(
        `http://localhost:5002/livres/${id}`
      );
      const quantite = livreResponse.data.data.quantite;
      if (quantite == 0)
        return res
          .status(400)
          .json({ message: "livre n'est pas disponible!", data: null });

      // update "quantite - 1"
      await axios.put(`http://localhost:5002/livres/${id}`, {
        quantite: quantite - 1,
      });
    } catch (error) {
      console.log(" app.post ~ error:", error);
      return res
        .status(error.status)
        .json({ message: error.response.data.message });
    }

    // Création de la commande
    const { clientID } = req.body;
    if (!clientID)
      return res.status(400).json({
        message: "Champs clientID est obligatoires.",
      });

    const db = await dbConnection();
    const startDate = new Date();
    const emprunt = {
      livreID: id,
      clientID,
      startDate,
      returnDate: null,
      status: "en cours",
    };

    await db.collection("Emprunts").insertOne(emprunt);

    // Send notification
    await axios.post("http://localhost:5005/notifications/", {
      clientID: clientID,
      message: `Vous avez emprunté un livre avec succès!`,
    });

    return res.status(201).json({
      message: "Commande créée avec succès!",
      data: emprunt,
    });
  } catch (error) {
    console.error(
      "Erreur lors du traitement :",
      error?.response?.data?.message || error.message
    );
    return res.status(500).json({ message: "Erreur serveur." });
  }
});

// Retourner un livre + Send notification (service Notifcation)
app.post("/emprunts/return/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      res.send("id dddddddddddd");
    }
    const db = await dbConnection();

    // Ceck emprunt exist
    const emprunt = await db
      .collection("Emprunts")
      .findOne({ _id: new ObjectId(id) });

    if (!emprunt)
      return res
        .status(404)
        .json({ message: "Emprunt non trouvé.", data: null });

    // Check if the book status == "returned"
    if (emprunt.status === "returned")
      return res
        .status(400)
        .json({ message: "Le livre a déjà été retourné.", data: null });

    // Set the returnDate
    const returnDate = new Date();

    // Update Emprunt in DB
    await db
      .collection("Emprunts")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { returnDate, status: "returned" } }
      );

    // Update the book's quantity (add 1)
    const livreResponse = await axios.get(
      `http://localhost:5002/livres/${emprunt.livreID}`
    );
    await axios.put(`http://localhost:5002/livres/${emprunt.livreID}`, {
      quantite: livreResponse.data.data.quantite + 1,
    });

    // Send notification to the client
    await axios.post("http://localhost:5005/notifications/", {
      clientID: emprunt.clientID,
      message: `Vous avez retourné le livre avec succès!`,
    });

    // Return success response
    return res.status(200).json({
      message: "Livre retourné avec succès!",
      data: { ...emprunt, returnDate, status: "returned" },
    });
  } catch (error) {
    console.error("Erreur lors du traitement :", error.message);
    return res
      .status(500)
      .json({ message: "Erreur serveur.", error: error.message });
  }
});

// Delete emprunt by id
app.delete("/emprunts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await dbConnection();
    const result = await db
      .collection("Emprunts")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Invalid Emprunt ID!" });

    return res.status(200).json({ message: `Emprunt est bien supprimer` });
  } catch (error) {
    return res.status(500).json({ message: "Serveur erreur !", error });
  }
});

// Server Listening
const port = process.env.EMPRUNTS_PORT || 5004;
app.listen(port, () => {
  console.log(`server "Emprunts" on http://localhost:${port}/`);
});
