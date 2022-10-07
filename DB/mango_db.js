// On imports le module Mongoose
const mongoose = require("mongoose");

// On sécurise notre password avec des variable d'environnements.
const password = process.env.DB_PASSWORD;

// ************ On se connecte à la base de donnée de mangoDB. ******
const db_mongo = mongoose
  .connect(
    `mongodb+srv://GM:${password}@cluster0.jruoy4f.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

module.exports = db_mongo;
