const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path"); // Node.js modul til sti-håndtering
const { importJSON } = require("../helpers/importJSON"); // Helper til at importere JSON-filer
const UserModel = require("../models/User");
const ProductModel = require("../models/Product");
const connectDB = require("../config/db");

// Load miljøvariabler fra lokal .env fil
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

// ==========================================================
// ARGUMENT FRA KOMMANDOLINJE
// ==========================================================
// process.argv indeholder kommandolinje-argumenter
// process.argv[2] er det første bruger-argument efter "node script.js"
const arg = process.argv[2];

const seedData = async () => {
  try {
    // Forbind til databasen
    await connectDB();

    // IMPORT USERS
    if (arg === "users") {
      // Hent data fra JSON fil
      const users = importJSON("users.json");

      // Slet eksisterende users i DB
      await UserModel.deleteMany();

      // Indsæt nye users fra JSON fil
      await UserModel.insertMany(users);

      console.log("Users imported");
    }

    // IMPORT PRODUCTS
    if (arg === "products") {
      // Hent data fra JSON fil
      const products = importJSON("products.json");

      // Slet eksisterende products i DB
      await ProductModel.deleteMany();

      // Indsæt nye produkter fra JSON fil
      await ProductModel.insertMany(products);

      console.log("Products imported");
    }

    // Afslut script succesfuldt
    process.exit();
  } catch (err) {
    // Hvis der opstår fejl, log den og afslut med fejlstatus
    console.error(err);
    process.exit(1);
  }
};

// Kør seed-funktionen
seedData();
