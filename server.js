// On importe le module HTTP du package npm.
const http = require("http");
const app = require("./app");
const PORT = 3000;

// On utilise la méthode du package http createServer().
const server = http.createServer(app);

// On écoute le port du serveur soit sur le PORT 300 ou autre.
server.listen(process.env.PORT || PORT, () => {
  try {
    console.log(`Serveur en écoute sur le PORT : ${PORT} :)`);
  } catch (error) {
    console.error(`Impossible de lancer le serveur ${error}`);
  }
});
