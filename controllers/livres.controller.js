const { ObjectId } = require("mongodb");

const dbConnection = require("../config/db");

// Get Livres - controller
const getLivres = async (req, res) => {
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
};

// Get Livre By Id -  controller
const getLivresById = async (req, res) => {
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
};

// Post Livre - controller
const addLivre = async (req, res) => {
  try {
    // {isbn, titre, auteur, categorie, annee_publication, editeur, langue, etat, tags, description}
    const newLivre = req.body;
    const db = await dbConnection();
    const result = await db
      .collection("Livres")
      .insertOne({ ...newLivre, disponible: true });
    return res.status(200).json({
      message: "Livre added successfuly!",
      data: { _id: result.insertedId, ...newLivre },
    });
  } catch (err) {
    console.log("addLivre ~ err:", err.message);
    return res.status(500).json({
      message: `Impossible de créer l'élément`,
      data: null,
    });
  }
};

// Put Livre - controller
const updateLivre = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const db = await dbConnection();
    const result = await db
      .collection("Livres")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Livre not found.",
        data: null,
      });
    }

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
};

// delete Livre - controller
const deleteLivre = async (req, res) => {
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
};

module.exports = {
  getLivres,
  getLivresById,
  addLivre,
  updateLivre,
  deleteLivre,
};
