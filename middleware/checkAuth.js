/* Import des modules necessaires */
const jwt = require("jsonwebtoken");

require("dotenv").config();

/* Verification authentification */
// Token Verify
module.exports = (req, res, next) => {
  try {
    // On récupere uniquement le token
    const token = req.headers.authorization.split(" ")[1];

    // Décoder le token
    const decodedToken = jwt.verify(token, process.env.KEY_TOKEN);
    const userId = decodedToken.userId;

    if (req.body.userId) {
      if (req.body.userId !== userId) {
        throw "Invalid user ID";
      }
    }

    req.auth = { userId: userId }; // Mise en palce de l'ID du token dans la requête pour les controllers
    next();
  } catch (error) {
    res.status(401).json({
      error: "Requête invalid",
    });
  }
};
// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const decodedToken = jwt.verify(token, process.env.KEY_TOKEN);
//     const userId = decodedToken.userId;
//     req.auth = {
//       userId: userId,
//     };
//     next();
//   } catch (error) {
//     res.status(401).json({ error });
//   }
// };
