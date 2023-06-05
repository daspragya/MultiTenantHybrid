const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require("./db");
const itemRouter = require("./routes/item-router");
const userRouter = require("./routes/user-router");
const supplierRouter = require("./routes/supplier-router");

const app = express();
const apiPort = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", itemRouter);
app.use("/api/auth", userRouter);
app.use("/api/supplier", supplierRouter);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
