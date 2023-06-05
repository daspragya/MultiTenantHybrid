const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Supplier = new Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("suppliers", Supplier);
