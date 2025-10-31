const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Fulde navn på brugeren
    name: { type: String, required: true },

    // Email skal være unik og påkrævet
    email: { type: String, required: true, unique: true },

    // Profilbillede, default hvis ingen er uploadet
    picture: {
      type: String,
      default: "/src/assets/img/users/no-user.jpg",
    },

    // Hashet password (ikke plaintext)
    hashedPassword: { type: String, required: true },

    // Rolle: admin eller guest, default = guest
    role: { type: String, enum: ["admin", "guest"], default: "guest" },
  },
  {
    timestamps: true, // Automatisk opret- og opdateringstidspunkt (createdAt, updatedAt)
  }
);

module.exports = mongoose.model("User", userSchema); // Opret model "User" baseret på schema
