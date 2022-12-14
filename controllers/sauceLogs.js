// importation du models de la base de donnée MongoDB
const Sauce = require("../models/UserSauce");
// importation des mudules
const fs = require("fs");

// On exports la logique de nos routes. De façon à comprendre ce qu'elle vont faire.

/******************** On récupere toutes nos sauces  *******/

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((allSauces) => {
      res.status(200).json(allSauces);
    })
    .catch((error) => {
      res.status(400).json({
        error,
      });
    });
};

/******************** On récupere une seule sauces  *******/

exports.getOneSauces = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((oneSauce) => res.status(200).json(oneSauce))
    .catch((error) =>
      res.status(404).json({ message: "Sauce non trouvé !", error })
    );
};

/*************************** Nous créeons nos sauces ***************/
exports.createSauces = (req, res, next) => {
  // On parse l'objet
  const sauceObject = JSON.parse(req.body.sauce);

  // Suppresion de l'id de l'objet et userId qui correspond au créateur de l'objet pour utiliser le token à la place
  delete sauceObject._id;

  //   On crée une nouvelle instance de Sauce
  const sauce = new Sauce({
    ...sauceObject,
    // Extraction de l'userId avec le token
    userId: req.auth.userId,

    // Protocole http, hôte,du serveur , nom du dossier image, nom de l'image à enregistrer
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,

    usersLiked: [],
    usersDisliked: [],
  });

  console.log("CONTENUE : userModels de new sauceObject : ");
  console.log(sauceObject);
  //   Enregistrer le produit dans la base de donnée
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Sauces enregistré dans la base de donnée.",
      });
    })
    .catch((error) => res.status(400).json({ error }));
  console.log("----------> Une nouvelle sauce à été enregistré", sauce);
};

/*************************** Nous modifions les sauces *************/

exports.modifySauces = (req, res, next) => {
  // On regarde si req.file existe ou non. S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant

  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
        // On récupere l'objet dans le corps de la requête
      }
    : { ...req.body };

  // On supprime le userId venant de la requête.
  delete sauceObject._userId;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // on vérifie si la sauce appartient bien à l'utilisateur qui nous envoie la requête.
      if (sauce.userId !== req.auth.userId) {
        res
          .status(400)
          .json({ message: "Cette objets ne vous appartient pas !" });
      } else {
        // c'est le bon utilisateur
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifié" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

/*************************** Supprimer les sauces *************/

exports.deleteSauces = (req, res, next) => {
  // Tout d’abord, nous devons nous assurer que la personne qui en fait la requête est bien celle qui a créé la Sauces.
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Nous vérifions si l’utilisateur qui a fait la requête de suppression est bien celui qui a créé la sauces.
      if (sauce.userId !== req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        // La méthode unlink() du package  fs  vous permet de supprimer un fichier du système de fichiers.
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() =>
              res
                .status(200)
                .json({ message: "Votre sauce à bien été supprimé !" })
            )
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

/*************************** Likes/ Dislikes Sauces *************/

exports.addLikes = (req, res, next) => {
  // Récuperer l'id dans l'url de la requête.
  console.log("---------> CONTENU : req.params", req.params);

  /*************  Ajouter son like. *********************/
  // Mise au format de l'id pour pouvoir chercher l'objets correspondants

  // Aller chercher l'objets dans la base de données.
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Si likes = 1, l'utilisateur aime
      console.log("--------> CONTENU : RESULT de la promesse :", sauce);

      console.log("--------_> CONTENU : req.body.likes", req.body.like);

      // // Si le usersLiked est FALSE et si like === 1
      if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        //   // // Mise à jours dans la Base de donnée
        Sauce.updateOne(
          { _id: req.params.id },

          { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
        )
          .then(() => res.status(201).json({ message: "Vous avez aimé +1" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })

    .catch((error) => res.status(404).json({ error }));

  /*************  Annuler son like. *********************/

  // Aller chercher l'objets dans la base de données.
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Si likes = 1, l'utilisateur aime

      if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
        // Mise à jours dans la Base de donnée
        Sauce.updateOne(
          { _id: req.params.id },

          { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
        )
          .then(() =>
            res.status(201).json({ message: "Vous avez retirer votre like. 0" })
          )
          .catch((error) => res.status(400).json({ error }));
      }
      /*************************** Ajouter un Dislikes   *************/

      console.log("------> CONTENU DE req.body.disliked", req.body.like);
      // like = -1 (dislike = +1)
      if (
        !sauce.usersDisliked.includes(req.body.userId) &&
        req.body.like === -1
      ) {
        // Mise à jours dans la Base de donnée
        Sauce.updateOne(
          { _id: req.params.id },

          {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "Dislike +1" }))
          .catch((error) => res.status(400).json({ error }));
      }

      /*************************** Annuler un  Dislikes   *************/

      if (
        sauce.usersDisliked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        // Mise à jours dans la Base de donnée
        Sauce.updateOne(
          { _id: req.params.id },

          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "Dislike 0" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })

    .catch((error) => res.status(404).json({ error }));

  // Si likes = -1, l'utilisateur n'aime pas (= dislike) la sauce.
};
