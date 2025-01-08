const express = require("express");
const dotenv = require("dotenv");

// Express App Initialization
const app = express();

// Middlewares
app.use(express.json());
dotenv.config();

// "!don" : routes
app.use("/auth", require("./routes/auth.route"));
app.use("/livres", require("./routes/livres.route"));

// "!Handling" : routes
app.use("/emprunts", require("./routes/emprunts.route"));

// "!To do" : routes
app.use("/clients", require("./routes/clients.route"));
app.use("/notifications", require("./routes/notifications.route"));
app.use("/payiement", require("./routes/payiement.route"));

// Server Listening
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server on http://localhost:${port}/`);
});
