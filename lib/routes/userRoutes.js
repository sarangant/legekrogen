const express = require("express");
const multer = require("multer"); // Middleware til upload af billeder
const bcrypt = require("bcryptjs"); // Password hashing
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { userStorage } = require("../misc/mStorage.js"); // multer storage config
const {
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getUsers,
} = require("../handlers/userHandler.js"); // funktioner til CRUD på users
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware.js"); // JWT + rolle middleware

const router = express.Router(); // opret router
const upload = multer({ storage: userStorage }); // multer config til billedupload

router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN ROUTE TRIGGERED", req.body);

    const { email, password } = req.body;

    // Find bruger i DB
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Ugyldigt login" });

    // Tjek om password matcher
    const valid = await bcrypt.compare(password, user.hashedPassword);
    if (!valid) return res.status(401).json({ message: "Ugyldigt login" });

    // Generer JWT token
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Token generated:", token);

    // Send token til klient
    res.json({ status: "ok", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post(
  "/",
  authenticateToken, // tjekker JWT token
  authorizeRoles("admin"), // kun admin kan oprette
  upload.single("image"), // håndter billedupload
  async (req, res) => {
    const { name, email, role, password } = req.body;

    // Tjek obligatoriske felter
    if (!name || !email || !role || !password)
      return res.status(400).json({ message: "Alle felter er påkrævet" });

    // Brug uploaded billede, ellers default
    const image = req.file?.filename
      ? `/users/${req.file.filename}`
      : "/users/no-user.jpg";

    // Opret bruger via handler
    const result = await createUser({ name, email, role, password, image });

    res.status(result.status === "ok" ? 201 : 500).json(result);
  }
);

router.get(
  "/",
  authenticateToken, // tjek JWT token
  authorizeRoles("admin"), // kun admin kan se alle
  async (req, res) => {
    const result = await getUsers();
    res.status(result.status === "ok" ? 200 : 500).json(result);
  }
);

router.get("/:id", authenticateToken, async (req, res) => {
  const userId = req.params.id;

  // Tjek om bruger er admin eller ejer af kontoen
  if (req.user.role !== "admin" && req.user.id !== userId) {
    return res.status(403).json({ message: "Ingen adgang" });
  }

  const result = await getUserById(userId);
  res.status(result.status === "ok" ? 200 : 404).json(result);
});

router.put("/", authenticateToken, upload.single("image"), async (req, res) => {
  const { id } = req.body;

  // Tjek om bruger er admin eller ejer af kontoen
  if (req.user.role !== "admin" && req.user.id !== id) {
    return res.status(403).json({ message: "Ingen adgang" });
  }

  const result = await updateUser(req.body);
  res.status(result.status === "ok" ? 200 : 404).json(result);
});

router.delete(
  "/:id",
  authenticateToken, // tjek JWT token
  authorizeRoles("admin"), // kun admin kan slette
  async (req, res) => {
    const result = await deleteUser(req.params.id);
    res.status(result.status === "ok" ? 200 : 404).json(result);
  }
);

module.exports = router; // eksport router
