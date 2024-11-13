const mongoose = require("mongoose");

const secretKeySchema = new mongoose.Schema(
  {
    value: { type: String, required: true },
  },
  { versionKey: false, collection: "SecretKey" }
);

const SecretKey = mongoose.model("SecretKey", secretKeySchema);
module.exports = SecretKey;
