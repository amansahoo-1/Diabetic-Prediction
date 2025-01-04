const mongoose = require("mongoose");

const UserInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  sex: String,
  age: Number,
  dob: Number,
  weight: Number,
  height: Number,
  contact_info: Number,
  address: String,
});

module.exports = mongoose.model("UserInfo", UserInfoSchema);
