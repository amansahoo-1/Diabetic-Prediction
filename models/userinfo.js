const mongoose = require("mongoose");

const UserInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sex: {
      type: String,
      enum: ["Male", "Female", "Transgender"],
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    dob: {
      type: Date,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    height: {
      type: Number,
      required: true,
      min: 0,
    },
    contact_info: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, // Matches a valid phone number (10 digits)
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model("UserInfo", UserInfoSchema);
