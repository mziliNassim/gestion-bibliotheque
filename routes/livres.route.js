const express = require("express");
const router = express.Router();

const {
  getLivres,
  getLivresById,
  addLivre,
  updateLivre,
  deleteLivre,
} = require("../controllers/livres.controller");

// Routes
router.get("/livres", getLivres);
router.get("/livres/:id", getLivresById);
router.post("/livres", addLivre);
router.put("/livres/:id", updateLivre);
router.delete("/livres/:id", deleteLivre);

module.exports = router;
