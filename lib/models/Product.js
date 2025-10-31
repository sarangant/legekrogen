const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Navn på produktet, påkrævet
    name: { type: String, required: true },

    // Pris på produktet, påkrævet
    price: { type: Number, required: true },

    // Beskrivelse af produktet, valgfrit
    description: { type: String },

    // Billede URL eller filsti, valgfrit
    image: { type: String },
  },
  {
    timestamps: true, // Automatisk opret- og opdateringstidspunkt (createdAt, updatedAt)
  }
);

module.exports = mongoose.model("Product", productSchema); // Opret model "Product" baseret på schema
