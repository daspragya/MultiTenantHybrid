const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const itemRouter = require("./routes/itemRouter");
const authRouter = require("./routes/authRouter");

const app = express();
const PORT = 8001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const corsOptions = {
  origin: "https://hybridmulti.onrender.com",
};

app.use(cors(corsOptions));

app.use("/api", itemRouter);
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
