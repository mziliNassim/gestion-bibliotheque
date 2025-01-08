const { Router } = require("express");
const router = Router();

const {
  emprunts,
  emprunt,
  returnEmprunt,
} = require("../controllers/emprunts.controller");

router.get("/", emprunts);
router.post("/", emprunt);
router.post("/return/:id", returnEmprunt);

module.exports = router;
