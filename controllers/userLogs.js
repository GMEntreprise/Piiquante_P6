// ********** Imports des mudules *********
const bcrypt = require("bcrypt"); // On utilise le package bcrypt pour créer un hash avec le mot de passe.

// On imports les fichiers locals
const User = require("../models/User");

// Importation de jsonwebtoken.
const jwt = require("jsonwebtoken");

// Importation pour utilisation des variables d'environnements.
require("dotenv").config();

// ********** On crée la logique *************

// Nous appellons notre fonction Signup. Pour l'enregistrement de nos utilisateurs.
exports.signup = (req, res, next) => {
  /* On appelle la function Bcrypt.hash() pour crypter le MDP.
    On lui passe le MDP du corps de la requête.
    Sale =  x10 sera exécuté l'agorithme de hash.
  */
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // On crée un nouveau Models
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateurs Crée !" }))
        .catch((error) =>
          res
            .status(400)
            .json({ message: "Cette e-mail à déja été utiliser ! ", error })
        );
    })
    .catch((error) => res.status(500).json({ error }));
};

// Login to BDD
// Nous appellons notre fonction Login. Pour que nos utilisateurs puisse ce connecter.
exports.login = (req, res) => {
  //   On cherche dans la base de données si l'utilisateur est bien présent
  User.findOne({ email: req.body.email })
    .then((user) => {
      //   Si le mail de l'utilisateur n'est pas présent , il n'existe pas.
      console.dir(
        "---> On essaye de trouver si l'utilisateur est enregistré dans la base de données."
      );
      console.log(`Contenue de user.findOne !  ${user}`);
      if (!user) {
        return res
          .status(401)
          .json({ message: "identifiant ou mot de passe incorrecte" });
      }
      // Controler la validité du password envoyer par le front.

      // req.body.password le mot de passe de l'utilisateur envoyer par le front. user.password est le mot de passe qui est hash il va comparer.
      bcrypt
        .compare(req.body.password, user.password)
        .then((controlPassword) => {
          console.dir(`Control du mot de passe : ${controlPassword}`);
          // Si le mot de passe est incorrect
          if (!controlPassword) {
            return res
              .status(401)
              .json({ message: "identifiant ou mot de passe incorrecte" });
          } else {
            // Si le mot de passe est correct
            // Envoie dans la réponse du serveur du userId et du token d'authentification.
            return res.status(200).json({
              // Encodage du userId pour la création de nouveau objets.(l'Objet et userId serons liés)
              userId: user._id,
              token: jwt.sign({ userId: user._id }, process.env.KEY_TOKEN, {
                expiresIn: "1h",
              }),
            });
          }
        })
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};
