// 404 - ROUTE IKKE FUNDET
const notFound = (req, res, next) => {
  // Opret en ny Error med besked om hvilken URL, der ikke blev fundet
  const error = new Error(`Ikke fundet - ${req.originalUrl}`);

  // Sæt HTTP statuskode til 404
  res.status(404);

  // Send fejlen videre til næste middleware (errorHandler)
  next(error);
};

// GENEREL FEJLHÅNDTERING
const errorHandler = (err, req, res, next) => {
  // Hvis statuskoden stadig er 200 (OK), skift til 500 (serverfejl)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Sæt statuskode og returner JSON med fejlbesked
  res.status(statusCode).json({
    message: err.message, // fejlbesked
    // Returner stack trace kun hvis vi ikke er i produktion
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
