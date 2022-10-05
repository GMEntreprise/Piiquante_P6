// On importe le module mongoose.
const mongoose = require("mongoose");

// mongoose-unique-validator passé comme plug-in, s'assurera que deux utilisateurs ne puissent partager la même adresse e-mail.
const uniqueValidator = require("mongoose-unique-validator");

// le modèle de base de données pour le signup (pour enregistrer un nouvel utilisateur.)
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
