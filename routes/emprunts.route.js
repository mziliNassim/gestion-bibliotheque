const { Router } = require("express");
const router = Router();

const {
  emprunts,
  emprunt,
  returnEmprunt,
} = require("../controllers/emprunts.controller");

// Routes
router.get("/", emprunts);
router.post("/", emprunt);
router.post("/return/:id", returnEmprunt);

module.exports = router;
