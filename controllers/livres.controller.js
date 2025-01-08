const dbConnection = require("../config/db");
const { ObjectId } = require("mongodb");

// getLivres controller
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

// getLivres controller
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
    console.log("getLivresById ~ error:", error);
    return res
      .status(500)
      .json({ message: "Impossible de récupérer le liver", data: null });
  }
};

// getLivres controller
const addLivre = async (req, res) => {
  try {
    const newLivre = req.body;
    const db = await dbConnection();
    const result = await db.collection("Livres").insertOne(newLivre);
    res.status(200).json({
      message: "Livre added successfuly!",
      data: { _id: result.insertedId, ...newLivre },
    });
  } catch (err) {
    console.log("addLivre ~ err:", err.message);
    res.status(500).json({
      message: `Impossible de créer l'élément`,
      data: null,
    });
  }
};

// getLivres controller
const updateLivre = async (req, res) => {
  res.status(200).json({ message: "success" });
};

// getLivres controller
const deleteLivre = async (req, res) => {
  res.status(200).json({ message: "success" });
};

module.exports = {
  getLivres,
  getLivresById,
  addLivre,
  updateLivre,
  deleteLivre,
};
