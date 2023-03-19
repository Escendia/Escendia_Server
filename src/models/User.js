const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  fireBaseID: {
    type: String,
    required: [true, "Please provide fireBaseID"],
  },
  userType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userType",
    default: "6128ab88866f7353e0c2fa91",
  },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
