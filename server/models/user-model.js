const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    suppliers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "suppliers",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", User);
