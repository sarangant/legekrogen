const express = require("express");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware.js"); // Middleware til JWT + rollecheck
const {
  getProducts,
  getProductById,
  importProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../handlers/productHandler.js"); // Funktioner til CRUD på produkter

const router = express.Router(); // Opret Express router

// PUBLIC ROUTES - ALLE KAN SE PRODUKTER

// Hent alle produkter (ingen login nødvendig)
router.get("/", getProducts);

// Hent enkelt produkt via ID (ingen login nødvendig)
router.get("/:id", getProductById);

// ADMIN ONLY ROUTES - KRÆVER JWT TOKEN OG ADMIN ROLLE

// Importer produkter fra JSON eller anden kilde
router.post(
  "/import",
  authenticateToken, // Tjek JWT token
  authorizeRoles("admin"), // Kun admin kan importere
  importProducts
);

// Opret nyt produkt
router.post(
  "/",
  authenticateToken, // Tjek JWT token
  authorizeRoles("admin"), // Kun admin
  createProduct
);

// Opdater eksisterende produkt via ID
router.put(
  "/:id",
  authenticateToken, // Tjek JWT token
  authorizeRoles("admin"), // Kun admin
  updateProduct
);

// Slet produkt via ID
router.delete(
  "/:id",
  authenticateToken, // Tjek JWT token
  authorizeRoles("admin"), // Kun admin
  deleteProduct
);

module.exports = router;
