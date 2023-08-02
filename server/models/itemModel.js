const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Item = new Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("items", Item);
