const mongoose = require("mongoose");
const DataBaseObject = require("./DataBaseObject");
const extendSchema = require("./extendSchema");

const AttributeSchema = extendSchema(DataBaseObject, {
  names: {
    type: Object,
  },
});

const Attribute = mongoose.model("attribute", AttributeSchema);

module.exports = Attribute;
