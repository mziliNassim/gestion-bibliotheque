const express = require("express");
const dotenv = require("dotenv");
const { ObjectId } = require("mongodb");

const dbConnection = require("../../config/db");

const app = express();

app.use(express.json());
dotenv.config();

// Routes
app.get("/emprunts", async (req, res) => {
  try {
    const db = await dbConnection();
    const emprunts = await db.collection("Emprunts").find().toArray();
    if (emprunts.length === 0)
      return res.status(200).json({ message: "No Emprunts found.", data: [] });

    return res
      .status(200)
      .json({ message: "Success, All Emprunts", data: emprunts });
  } catch (error) {
    console.log("returnEmprunt ~ error:", error);
    return res.status(500).json({ message: "Invalid Operation.", data: null });
  }
});

app.post("/emprunts", async (req, res) => {
  try {
    const { livreId, clientId } = req.body;

    // Data vlaidation
    if (!livreId || !clientId)
      return res
        .status(400)
        .json({ message: "Tous les champs sont requis.", data: null });

    // is livre disponible
    const db = await dbConnection();
    const livre = await db
      .collection("Livres")
      .findOne({ _id: new ObjectId(livreId) });

    if (!livre)
      return res.status(404).json({ message: "Livre non trouvé.", data: null });

    if (!livre.disponible)
      return res
        .status(400)
        .json({ message: "Le livre n'est pas disponible.", data: null });

    // Créer Emprunt
    const emprunt = {
      livreId: new ObjectId(livreId),
      clientId: new ObjectId(clientId),
      startDate: new Date(),
      returnDate: null,
      status: "en cours",
    };

    // Enregistrer Emprunt dans DB
    const result = await db.collection("Emprunts").insertOne(emprunt);

    // Update livre disponibilité
    await db
      .collection("Livres")
      .updateOne(
        { _id: new ObjectId(livreId) },
        { $set: { disponible: false } }
      );

    res.status(201).json({
      message: "Emprunt créé avec succès.",
      data: await db.collection("Emprunts").findOne({ _id: result.insertedId }),
    });
  } catch (error) {
    console.log("emprunt ~ error:", error.message);
    return res
      .status(500)
      .json({ message: "Imposibel d'emprunter le livre.", data: null });
  }
});

app.post("/emprunts/return/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const db = await dbConnection();
    const emprunt = await db
      .collection("Emprunts")
      .findOne({ _id: new ObjectId(id) });

    // Vérifier si l'emprunt existe et est en cours
    if (!emprunt || emprunt.status !== "en cours")
      return res
        .status(404)
        .json({ message: "Emprunt non trouvé ou déjà retourné.", data: null });

    // Mettre à jour l'état de l'emprunt à "retourné" et la date de retour
    const livreId = emprunt.livreId;
    await db
      .collection("Emprunts")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "retourné", returnDate: new Date() } }
      );

    // Mettre à jour l'état du livre à "disponible" dans la collection "Livres"
    await db
      .collection("Livres")
      .updateOne(
        { _id: new ObjectId(livreId) },
        { $set: { disponible: true } }
      );

    return res.status(200).json({
      message: "Livre retourné avec succès.",
      data: await db.collection("Emprunts").findOne({ _id: new ObjectId(id) }),
    });
  } catch (error) {
    console.log("returnEmprunt ~ error:", error);
    return res.status(500).json({ message: "Invalid Operation.", data: null });
  }
});

// Server Listening
const port = process.env.EMPRUNTS_PORT || 5004;
app.listen(port, () => {
  console.log(`server "Emprunts" on http://localhost:${port}/`);
});
