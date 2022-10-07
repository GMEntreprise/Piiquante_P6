// On importe les modules.
const express = require("express");
const cors = require("cors");

// On importes les fichiers local.
const stuffRoute = require("./routes/userList");
const userRoutes = require("./routes/userConnect");

// Imports les fonctions.
const app = express();

/* *********** MIDDLEWARE *************
On analyse le Corps de la requêtes. / CORS */

app.use(express.json());
// app.use(cors());

// ************ On se connecte à la base de donnée de mangoDB. ******
const DB = require("./DB/mango_db");

// On ajoute des CORS à notre app pour éviter des erreurs CORS.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Nous permet d'acceder à notre API depuis n'importe quelle origine "*".
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization" // Autorisation d'utiliser certain headers sur l'objets requêtes.
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); // On autorise à envoyer certaines requêtes avec les méthodes GET,POST, PUT etc...
  next();
});

//   *********** Logiques des routes.*************
// La route d'authentification.
app.use("/api/auth", userRoutes);

/*----------------------------------------------*/
// On exports le fichier app pour qu'il soit disponible partout
module.exports = app;
