const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

const createConnection = (tenantID) => {
  mongoose
    .connect(`${process.env.DATABASE_CONNECTION_STRING}/${tenantID}_ITEMS`, {
      useNewUrlParser: true,
    })
    .catch((e) => {
      console.error("Connection error", e.message);
    });
  return mongoose.connection;
};

const removeConnection = () => {
  try {
    mongoose.connection.close();
  } catch {
    (e) => {
      console.error("Connection error", e.message);
    };
  }
};

module.exports = { createConnection, removeConnection };
