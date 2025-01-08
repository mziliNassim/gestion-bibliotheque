const dbConnection = require("../config/db");
const { ObjectId } = require("mongodb");

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
    const newLivre = req.body;
    const db = await dbConnection();
    const result = await db.collection("Livres").insertOne(newLivre);
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
    const updatedLivre = req.body;
    const db = await dbConnection();
    const result = await db
      .collection("Livres")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedLivre });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Livre not found.",
        data: null,
      });
    }

    if (result.modifiedCount === 0) {
      return res.status(200).json({
        message: "No changes made to the Livre.",
        data: updatedLivre,
      });
    }

    return res.status(200).json({
      message: "Livre updated successfully!",
      data: { _id: id, ...updatedLivre },
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
