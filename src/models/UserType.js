const mongoose = require("mongoose");

const UserTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "Please provide a name"],
  },
  permission: {
    type: [String],
    default: [""],
  },
  color: {
    type: String,
    default: "0 0 0",
  },
});

const UserType = mongoose.model("userType", UserTypeSchema);

module.exports = UserType;