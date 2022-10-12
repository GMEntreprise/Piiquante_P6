//  On imports les mudules
const express = require("express");
// Récupération des routes.
const router = express.Router();
// Importation du middleware d'authenfication
const checkAuth = require("../middleware/checkAuth");

// Importation de multer
const multer = require("../middleware/multer-config");

// Importation du controllers userSauce
const sauceCtrl = require("../controllers/sauceLogs");

/**********  Les routes ***********/

// Renvoie la sauce avec l’_id fourni.
router.get("/:id", checkAuth, sauceCtrl.getOneSauces);

// Renvoie un tableau de toutes les sauces de la base de données.
router.get("/", checkAuth, sauceCtrl.getAllSauces);

// On enregistre nos sauces et images.
router.post("/", checkAuth, multer, sauceCtrl.createSauces);

// On modifie nos sauces et les mets à jours.
router.put("/:id", checkAuth, multer, sauceCtrl.modifySauces);

// On supprime les sauces.
router.delete("/:id", checkAuth, sauceCtrl.deleteSauces);

//  On imports le fichier pour qu'il soit disponible partout.
module.exports = router;
