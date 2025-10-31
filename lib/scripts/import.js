const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");
const { importJSON } = require("../helpers/importJSON");
const UserModel = require("../models/User");
const ProductModel = require("../models/Product");
const connectDB = require("../config/db");

// Load miljøvariabler
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const arg = process.argv[2];

const seedData = async () => {
  try {
    await connectDB();

    if (arg === "users") {
      const users = importJSON("users.json");

      // Hash passwords fra .env.local
      const usersWithHashedPasswords = users.map((user) => {
        let plainPassword;

        // Tildel password afhængigt af rolle
        if (user.role === "admin") {
          plainPassword = process.env.ADMIN_PASSWORD;
        } else {
          plainPassword = process.env.GUEST_PASSWORD;
        }

        if (!plainPassword) {
          throw new Error(
            `Password for role ${user.role} er ikke sat i .env.local`
          );
        }

        return {
          ...user,
          hashedPassword: bcrypt.hashSync(plainPassword, 10),
        };
      });

      await UserModel.deleteMany();
      await UserModel.insertMany(usersWithHashedPasswords);
      console.log("✅ Users imported with hashed passwords from .env.local");
    }

    if (arg === "products") {
      const products = importJSON("products.json");

      await ProductModel.deleteMany();
      await ProductModel.insertMany(products);
      console.log("✅ Products imported");
    }

    process.exit();
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seedData();
