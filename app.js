const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.use(express.json());

// "!don" : routes
app.use("/auth", require("./routes/auth.route"));

// "!To do" : routes
app.use("/livres", require("./routes/livres.route"));
app.use("/emprunts", require("./routes/emprunts.route"));
app.use("/clients", require("./routes/clients.route"));
app.use("/notifications", require("./routes/notifications.route"));
app.use("/payiement", require("./routes/payiement.route"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server on http://localhost:${port}/`);
});
