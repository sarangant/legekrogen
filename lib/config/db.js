const mongoose = require("mongoose"); // MongoDB ORM til Node.js

// CONNECT DB - funktion til at forbinde til MongoDB
const connectDB = async () => {
  try {
    // Tjek om MONGO_URI findes i miljøvariabler
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI mangler!");

    // Forbind til MongoDB via MONGO_URI
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log host navn hvis forbindelse lykkes
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    // Log fejl og luk server, hvis forbindelsen fejler
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
