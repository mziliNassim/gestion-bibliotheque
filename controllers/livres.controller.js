const dbConnection = require("../config/db");

// getLivres controller
const getLivres = (req, res) => {
  res.status(200).json({ message: "success" });
};

// getLivres controller
const getLivresById = (req, res) => {
  res.status(200).json({ message: "success" });
};

// getLivres controller
const addLivre = (req, res) => {
  res.status(200).json({ message: "success" });
};

// getLivres controller
const updateLivre = (req, res) => {
  res.status(200).json({ message: "success" });
};

// getLivres controller
const deleteLivre = (req, res) => {
  res.status(200).json({ message: "success" });
};

module.exports = {
  getLivres,
  getLivresById,
  addLivre,
  updateLivre,
  deleteLivre,
};
