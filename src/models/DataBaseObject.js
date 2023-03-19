const mongoose = require("mongoose");
const User = require("./User");

const DataBaseObjectSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  createdDate: {
    type: Date,
    default: new Date(),
    required: [true, "api.error.date.createdDate"],
  },
  status: {
    type: String,
    default: "created",
  },
  database: {
    type: String,
    //required: [true, "api.error.date.database"]
  },
  statusChangedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  statusChangedAt: {
    type: Date,
  },
  lastUpdate: {
    type: Date,
  },
});

const DataBaseObject = mongoose.model("databaseObject", DataBaseObjectSchema);

module.exports = DataBaseObject;
