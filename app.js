const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.use(express.json());

// routes
app.use("/auth", require("./routes/auth.route")); // authentification
app.use("/livres", require("./routes/livres.route")); // authentification

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server on http://localhost:${port}/`);
});
