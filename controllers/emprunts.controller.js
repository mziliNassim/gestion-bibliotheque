const { ObjectId } = require("mongodb");

const dbConnection = require("../config/db");

// GET Emprints - controller
const emprunts = async (req, res) => {
  try {
    const db = await dbConnection();
    const emprunts = await db.collection("Emprunts").find().toArray();
    return res.status(200).json({ message: "Success", data: emprunts });
  } catch (error) {
    console.log("returnEmprunt ~ error:", error);
    return res.status(500).json({ message: "Invalid Operation.", data: null });
  }
};

// POST Emprunt - controller
const emprunt = async (req, res) => {
  try {
    const { livreId, clientId, startDate, returnDate } = req.body;

    // Data vlaidation
    if (!livreId || !clientId || !startDate || !returnDate)
      return res
        .status(400)
        .json({ message: "Tous les champs sont requis.", data: req.body });

    // is livre disponible
    const db = await dbConnection();
    const livre = await db
      .collection("Livres")
      .findOne({ _id: new ObjectId(livreId) });

    if (!livre)
      return res.status(404).json({ message: "Livre non trouvé.", data: null });

    if (livre.etat !== "disponible")
      return res
        .status(400)
        .json({ message: "Le livre n'est pas disponible.", data: null });

    // Créer Emprunt
    const emprunt = {
      livreId: new ObjectId(livreId),
      clientId: new ObjectId(clientId),
      startDate: new Date(startDate),
      dueDate: new Date(returnDate),
      status: "en cours",
    };

    // Enregistrer Emprunt dans DB
    const result = await db.collection("Emprunts").insertOne(emprunt);

    // Update livre disponibilité
    await db
      .collection("Livres")
      .updateOne(
        { _id: new ObjectId(livreId) },
        { $set: { etat: "emprunté" } }
      );

    res.status(201).json({
      message: "Emprunt créé avec succès.",
      data: { _id: result.insertedId, ...req.body },
    });
  } catch (error) {
    console.log("emprunt ~ error:", error.message);
    return res
      .status(500)
      .json({ message: "Imposibel d'emprunter le livre.", data: null });
  }
};

// POST Return Emprunt - controller
const returnEmprunt = async (req, res) => {
  try {
  } catch (error) {
    console.log("returnEmprunt ~ error:", error);
    return res.status(500).json({ message: "Invalid Operation.", data: null });
  }
};

module.exports = { emprunts, emprunt, returnEmprunt };
