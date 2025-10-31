const multer = require("multer"); // Middleware til håndtering af filupload i Express
const path = require("path"); // Node.js modul til at arbejde med filstier
const fs = require("fs"); // Node.js modul til filsystem-operationer (oprette mapper, tjekke filer osv.)

// FUNKTION TIL AT OPRETTE MULTER STORAGE
const createStorage = (folderName) => {
  // Opretter den absolutte sti til upload-mappen
  // folderName kan fx være "users" eller "products"
  const uploadPath = path.join(__dirname, "../public", folderName);

  // Tjekker om mappen allerede findes
  // Hvis ikke, opretter vi den rekursivt (opretter også nødvendige parent-mapper)
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // Konfigurerer multer til at gemme filer i den specifikke mappe
  return multer.diskStorage({
    // destination: bestemmer hvor filen gemmes
    destination: (req, file, cb) => cb(null, uploadPath),

    // filename: bestemmer hvordan filen skal navngives
    // her: fieldname + timestamp + original filtype
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname); // hent filtypen (fx .jpg, .png)
      cb(null, file.fieldname + "-" + Date.now() + ext); // fx "image-1698000000000.jpg"
    },
  });
};

// EXPORTER MULTER STORAGE
const userStorage = createStorage("users"); // Storage til bruger-billeder
const productStorage = createStorage("products"); // Storage til produkt-billeder

// Eksporter storage objekterne, så de kan bruges i routes
module.exports = { userStorage, productStorage };
