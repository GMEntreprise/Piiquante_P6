// On importe les modules.
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// On importes les fichiers
const userModels = require("./models/User");
// Imports les fonctions.
const app = express();

/* *********** MIDDLEWARE *************
On analyse le Corps de la requêtes. */

app.use(express.json());
app.use(cors());

// ************ On se connecte à la base de donnée de mangoDB. ******
mongoose
  .connect(
    "mongodb+srv://GM:5fi4vgi35xQiUbdp@cluster0.jruoy4f.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//   On crée une route post pour le Signup de l'utilisateurs.
app.post("/api/auth/signup", (req, res, next) => {
  console.log("Signup request : ", req.body);
  res.send("Utilisateur enregistrer !");
  const users = new userModels({
    // On utilise le Spread operator. Sa retourne à faire req.body.email.
    ...req.body,
  });
  users
    .save()
    .then(() => res.status(201).json({ message: "Utilisateur enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.get("/", (req, res, next) => {
  res.send("Hello guys my name is Georges-Michel Edouard !");
});

// On ajoute des CORS à notre app pour éviter des erreurs CORS.

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*"); // Nous permet d'acceder à notre API depuis n'importe quelle origine "*".
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization" // Autorisation d'utiliser certain headers sur l'objets requêtes.
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   ); // On autorise à envoyer certaines requêtes avec les méthodes GET,POST, PUT etc...
//   next();
// });
/*----------------------------------------------*/
// On exports le fichier app pour qu'il soit disponible partout
module.exports = app;
