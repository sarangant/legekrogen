# Legekrogen - Fullstack

Dette er backend-delen af Legekrogen-projektet. Den er bygget med **Node.js**, **Express**, **MongoDB** og håndterer brugere, produkter, billeduploads og JWT-baseret autentifikation.

---

## Funktioner

- **Brugerhåndtering**

  - Opret, opdater, slet og hent brugere
  - Login med email/password
  - Password hashing med bcrypt
  - JWT-token autentifikation
  - Role-baseret adgangskontrol (`admin` og `guest`)

- **Produktstyring**

  - Opret, opdater, slet og hent produkter
  - Import af produkter fra JSON
  - Offentlige GET endpoints

- **Filupload**

  - Upload af bruger- og produktbilleder via `multer`
  - Gemmes i `public/users` og `public/products`
  - Tilgås via URL: `/users/<filename>` og `/products/<filename>`

- **Error handling**

  - 404 route ikke fundet
  - Generel fejlhåndtering med stack trace i udvikling

- **CORS**

  - Tillader kun frontend på `http://localhost:5173`
  - Tillader metoder: GET, POST, PUT, DELETE

---

## Installation

1. **Clone repository**

```bash
git clone <repo-url>
cd legekrogen-backend
```

2. **Installer dependencies**

```bash
npm install
```

3. **Opret `.env.local`** i roden af projektet og tilføj:

```
MONGO_URI=<din_mongodb_uri>
JWT_SECRET=<hemmelig_token_nøgle>
JWT_EXPIRES_IN=1h
PORT=5500
```

4. **Start server**

```bash
npm run dev
```

Serveren kører nu på `http://localhost:5500`

---

## API Endpoints

### Users

| Route              | Method | Beskrivelse              | Adgang                  |
| ------------------ | ------ | ------------------------ | ----------------------- |
| `/api/users/login` | POST   | Login med email/password | Offentlig               |
| `/api/users`       | GET    | Hent alle brugere        | Admin                   |
| `/api/users`       | POST   | Opret bruger             | Admin                   |
| `/api/users/:id`   | GET    | Hent bruger via ID       | Admin eller bruger selv |
| `/api/users`       | PUT    | Opdater bruger           | Admin eller bruger selv |
| `/api/users/:id`   | DELETE | Slet bruger              | Admin                   |

### Products

| Route                  | Method | Beskrivelse                 | Adgang    |
| ---------------------- | ------ | --------------------------- | --------- |
| `/api/products`        | GET    | Hent alle produkter         | Offentlig |
| `/api/products/:id`    | GET    | Hent produkt via ID         | Offentlig |
| `/api/products/import` | POST   | Importer produkter fra JSON | Admin     |
| `/api/products`        | POST   | Opret produkt               | Admin     |
| `/api/products/:id`    | PUT    | Opdater produkt             | Admin     |
| `/api/products/:id`    | DELETE | Slet produkt                | Admin     |

---

## Filupload

- Brug `multer` til upload af billeder
- Brugerbilleder: gemmes i `public/users`
- Produktbilleder: gemmes i `public/products`
- Eksempel URL:

```
http://localhost:5500/users/image-1698000000000.jpg
```

---

## Database

- MongoDB
- Bruger model:

  - `name`, `email`, `picture`, `hashedPassword`, `role`

- Produkt model:

  - `name`, `price`, `description`, `image`

---

## Kørsel af seeds (dummy data)

```bash
node lib/scripts/import.js users
node lib/scripts/import.js products
```

---

## Teknologier

- Node.js
- Express
- MongoDB + Mongoose
- JWT
- bcryptjs
- multer
- dotenv
- cors

---

## Licens

MIT License
