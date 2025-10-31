const jwt = require("jsonwebtoken");

// JWT MIDDLEWARE: tjekker om der er token og om det er gyldigt
const authenticateToken = (req, res, next) => {
  // Hent Authorization header (forventes: "Bearer <token>")
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // Split og hent token-delen

  // Hvis ingen token findes, send 401 Unauthorized
  if (!token) return res.status(401).json({ message: "Ingen token" });

  // Verificer token med JWT_SECRET
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Token ugyldig eller udløbet" });

    // Gem payload fra token i req.user, så andre middleware/routes kan bruge det
    req.user = decoded;

    // Gå videre til næste middleware eller route handler
    next();
  });
};

// ROLE-BASERET MIDDLEWARE: tjekker brugerens rolle
const authorizeRoles =
  (
    ...roles // accepterer et vilkårligt antal roller, fx "admin", "guest"
  ) =>
  (req, res, next) => {
    // Hvis brugerens rolle ikke findes i listen, send 403 Forbidden
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Ingen adgang" });

    // Ellers gå videre
    next();
  };

module.exports = { authenticateToken, authorizeRoles };
