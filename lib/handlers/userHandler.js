const User = require("../models/User");
const bcrypt = require("bcryptjs"); // Til at hash og sammenligne passwords
const jwt = require("jsonwebtoken");

// CREATE USER - opret ny bruger
const createUser = async ({ name, email, role, password, image }) => {
  try {
    // Tjek om email allerede findes
    const existing = await User.findOne({ email });
    if (existing) return { status: "error", message: "Email findes allerede" };

    // Hash password før gemning
    const hashedPassword = await bcrypt.hash(password, 10);

    // Opret bruger i databasen
    const newUser = await User.create({
      name,
      email,
      role,
      hashedPassword,
      picture: image, // billede URL/stif
    });

    return { status: "ok", user: newUser };
  } catch (err) {
    return { status: "error", message: err.message };
  }
};

// UPDATE USER - opdater eksisterende bruger
const updateUser = async (data) => {
  try {
    const { id, ...fields } = data; // Hent ID og andre felter
    const user = await User.findById(id);
    if (!user) return { status: "not_found", message: "Bruger ikke fundet" };

    // Opdater felter dynamisk
    Object.assign(user, fields);
    await user.save();

    return { status: "ok", user };
  } catch (err) {
    return { status: "error", message: err.message };
  }
};

// DELETE USER - slet bruger via ID
const deleteUser = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) return { status: "not_found", message: "Bruger ikke fundet" };

    await user.deleteOne(); // Slet brugeren
    return { status: "ok", message: "Bruger slettet" };
  } catch (err) {
    return { status: "error", message: err.message };
  }
};

// GET USER BY ID - hent bruger via ID
const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) return { status: "not_found", message: "Bruger ikke fundet" };

    return { status: "ok", user };
  } catch (err) {
    return { status: "error", message: err.message };
  }
};

// GET USERS - hent alle brugere
const getUsers = async () => {
  try {
    const users = await User.find({});
    return { status: "ok", users };
  } catch (err) {
    return { status: "error", message: err.message };
  }
};

// LOGIN USER - autentificer bruger og generer JWT
const loginUser = async (email, password) => {
  try {
    // Find bruger via email
    const user = await User.findOne({ email });
    if (!user)
      return { status: "error", message: "Ugyldig email eller password" };

    // Sammenlign plaintext password med hashed password i databasen
    const match = await bcrypt.compare(password, user.hashedPassword);
    if (!match)
      return { status: "error", message: "Ugyldig email eller password" };

    // Generer JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role }, // payload
      process.env.JWT_SECRET, // hemmelig nøgle
      { expiresIn: process.env.JWT_EXPIRES_IN } // levetid
    );

    return { status: "ok", user, token };
  } catch (err) {
    return { status: "error", message: err.message };
  }
};

// EXPORTER HANDLERS
module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getUsers,
  loginUser,
};
