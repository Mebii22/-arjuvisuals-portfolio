const express = require("express");
const router = express.Router();
const {
  getDisciplines,
  createDiscipline,
  deleteDiscipline,
} = require("../controllers/disciplineController");
const protectAdmin = require("../middleware/authMiddleware");

// Public route to fetch all disciplines
router.get("/", getDisciplines);

// Protected admin routes to create or delete disciplines
router.post("/", protectAdmin, createDiscipline);
router.delete("/:id", protectAdmin, deleteDiscipline);

module.exports = router;

