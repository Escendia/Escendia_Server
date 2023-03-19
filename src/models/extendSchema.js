const mongoose = require("mongoose");

function extendSchema(Schema, definition, options) {
  let schema = new mongoose.Schema(
    Object.assign({}, Schema.schema.obj, definition),
    options
  );
  return schema;
}

module.exports = extendSchema;