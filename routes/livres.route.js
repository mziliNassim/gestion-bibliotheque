const express = require("express");
const router = express.Router();

const {
  getLivres,
  getLivresById,
  addLivre,
  updateLivre,
  deleteLivre,
} = require("../controllers/livres.controller");

// Routes !don
router.get("/", getLivres);
router.get("/:id", getLivresById);
router.post("/", addLivre);

// Routes !To do
router.put("/:id", updateLivre);
router.delete("/:id", deleteLivre);

module.exports = router;
