// Multer : pour gérer les requêtes HTTP avec envoie de fichier

// Importation
const multer = require("multer");

// Le dictionnaire de MIME TYPES
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// La destination du fichier (répertoire) et générer un nom de fichier unique

const storage = multer.diskStorage({
  // la destinination de stockage du fichier
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier.
  filename: (req, file, callback) => {
    // Supprimer les espaces dans le nom du fichier et remplacer par des underscores.
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];

    // On ajoute un TimeStamp pour le rendre le plus Unique que possible.
    callback(null, name + Date.now() + "." + extension);
  },
});

// exportation de multer
module.exports = multer({ storage }).single("image");
