const mongoose = require("mongoose");
const UserType = require("../models/UserType");

const connectDB = async (auth) => {
  await mongoose.connect(process.env.DATABASE_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const user = {
    _id: "6128ab88866f7353e0c2fa91",
    type: "user",
    permission: [""],
    color: "136 136 136",
  };

  const superUser = {
    _id: "6128ab88866f7353e0c2fa94",
    type: "superUser",
    permission: [""],
    color: "200 200 200",
  };

  const admin = {
    _id: "6128ab88866f7353e0c2fa95",
    type: "admin",
    permission: ["*"],
    color: "255 0 0",
  };

  console.log("Create Default User Type...");


  UserType.findByIdAndUpdate(user._id, user).then(function (users, err) {
    if (users === null || users.length === 0) {
      UserType.create(user).then(function (newUserType, err) {
        console.log("newUserType", user.type);
      });
    }
  });

  UserType.findByIdAndUpdate(superUser._id, superUser).then(function (
    users,
    err
  ) {
    if (users === null || users.length === 0) {
      UserType.create(superUser).then(function (newUserType, err) {
        console.log("newUserType", superUser.type);
      });
    }
  });

  UserType.findByIdAndUpdate(admin._id, admin).then(function (users, err) {
    if (users === null || users.length === 0) {
      UserType.create(admin).then(function (newUserType, err) {
        console.log("newUserType", admin.type);
      });
    }
  });

  console.log("Create Default User Type finished!");


  console.log("MongoDB Connected");
};

module.exports = connectDB;
