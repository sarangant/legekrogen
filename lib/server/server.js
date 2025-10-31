const express = require("express");
const dotenv = require("dotenv");
const path = require("path"); // Node.js modul til sti-håndtering
const cors = require("cors"); // Middleware til håndtering af CORS
const connectDB = require("../config/db.js"); // Funktion til at forbinde til MongoDB
const { notFound, errorHandler } = require("../middleware/errorMiddleware.js"); // Custom error middleware
const userRoutes = require("../routes/userRoutes.js");
const productRoutes = require("../routes/productRoutes.js");

// KONFIGURER MILJØVARIABLER
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

// FORBIND TIL MONGODB
connectDB();

// OPRET EXPRESS APP
const app = express();

// Middleware til at parse JSON i request body
app.use(express.json());

// Middleware til at håndtere CORS (cross-origin resource sharing)
app.use(
  cors({
    origin: "http://localhost:5173", // tillad kun denne frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // tilladte HTTP-metoder
    allowedHeaders: ["Content-Type", "Authorization"], // tilladte headers
    credentials: true, // tillad cookies/authentifikation
  })
);

// STATISKE FOLDER TIL UPLOADS

// Gør uploaded brugerbilleder tilgængelige via URL: /users/filnavn.jpg
app.use("/users", express.static(path.join(__dirname, "../public/users")));

// Gør uploaded produktbilleder tilgængelige via URL: /products/filnavn.jpg
app.use(
  "/products",
  express.static(path.join(__dirname, "../public/products"))
);

// ROUTES
app.use("/api/users", userRoutes); // Bruger-routes (login, CRUD)
console.log("Registering /api/products route...");
app.use("/api/products", productRoutes); // Produkt-routes (CRUD)

// ERROR HANDLING MIDDLEWARE
app.use(notFound); // 404 - route findes ikke
app.use(errorHandler); // Generel fejlhåndtering

// START SERVER
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server kører på port ${PORT}`));
