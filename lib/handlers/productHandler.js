const Product = require("../models/Product"); // MongoDB Product model
const products = require("../../data/products.json"); // Dummy produkter til import

// GET PRODUCTS - hent alle produkter
const getProducts = async (req, res) => {
  try {
    // Hent alle produkter fra databasen
    const allProducts = await Product.find({});
    res.json(allProducts); // returner som JSON
  } catch (err) {
    console.error("getProducts error:", err);
    res.status(500).json({ message: "Fejl ved hentning af produkter" });
  }
};

// GET PRODUCT BY ID - hent produkt via ID
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id); // Find produkt via ID
  if (product) res.json(product); // send produkt
  else res.status(404).json({ message: "Produkt ikke fundet" }); // hvis ikke fundet
};

// IMPORT PRODUCTS - importer produkter fra JSON
const importProducts = async (req, res) => {
  // Slet eksisterende produkter
  await Product.deleteMany();

  // Insert produkter fra JSON
  const created = await Product.insertMany(products);

  // Returner oprettede produkter
  res.status(201).json(created);
};

// CREATE PRODUCT - opret nyt produkt
const createProduct = async (req, res) => {
  const { name, price, description, image } = req.body;

  // Opret nyt produkt objekt
  const newProduct = new Product({ name, price, description, image });

  // Gem produkt i databasen
  const saved = await newProduct.save();

  // Returner gemt produkt med status 201 Created
  res.status(201).json(saved);
};

// UPDATE PRODUCT - opdater eksisterende produkt
const updateProduct = async (req, res) => {
  // Find produkt via ID og opdater med req.body
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // returner den opdaterede version
  });

  if (updated) res.json(updated); // returner opdateret produkt
  else res.status(404).json({ message: "Produkt ikke fundet" }); // hvis ikke fundet
};

// DELETE PRODUCT - slet produkt
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne(); // slet produkt
    res.json({ message: "Produkt slettet" });
  } else res.status(404).json({ message: "Produkt ikke fundet" }); // hvis ikke fundet
};

module.exports = {
  getProducts,
  getProductById,
  importProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
