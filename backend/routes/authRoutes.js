const express = require("express");
const router = express.Router();

const { adminLogin, changePassword } = require("../controllers/authController");
const protectAdmin = require("../middleware/authMiddleware");

// Public admin login
router.post("/login", adminLogin);

// Protected change password
router.put("/password", protectAdmin, changePassword);

// Protected admin profile
router.get("/me", protectAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    admin: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
});

module.exports = router;