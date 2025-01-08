const { Router } = require("express");
const router = Router();

const {
  getClinets,
  getClinetById,
  addClinet,
  updateClinetById,
  deleteClinet,
} = require("../controllers/clinets.controller.js");

// Routes
router.get("/", getClinets);
router.get("/:id", getClinetById);
router.post("/", addClinet);
router.put("/:id", updateClinetById);
router.delete("/:id", deleteClinet);

module.exports = router;
