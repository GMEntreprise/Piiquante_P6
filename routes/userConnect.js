// On imports les mudules
const express = require("express");
const router = express.Router(); // On créé un routeur avec la méthode Routeur() EXPRESS

// On imports les fichier local.
const userCtrl = require("../controllers/userCtrl");

// *********** Nous implémentons les routes pour **********

/*   On crée une route post pour le Signup de l'utilisateurs. 
    Nous importons notre fonction signup.
*/
router.post("/signup", userCtrl.signup);

// La route Login
router.post("/login", userCtrl.login);

//  On imports le fichier pour qu'il soit disponible partout.
module.exports = router;
