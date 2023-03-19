//const express = require("express");
//const axios = require("axios");
const mongoose = require("mongoose");

const ErrorResponse = require("../utils/errorResponse");

const Attribute = require("../models/Attribute");
const UserType = require("../models/UserType");
const User = require("../models/User");

//import parseJson from 'parse-json'
const parseJson = require("parse-json");

exports.deleteDataRoute = async (req, res, next) => {
  let databaseString = undefined;
  let data = req.body;
  let isArray = Array.isArray(data);

  if (isArray) {
    databaseString =
      data[0].database !== undefined ? data[0].database : undefined;
  } else {
    databaseString = data.database !== undefined ? data.database : undefined;
  }

  if (databaseString === undefined)
    return next(new ErrorResponse("Not Databasefound found!", 4001));
  let modelObject = getModelObject(databaseString);

  if (modelObject === undefined)
    return next(
      new ErrorResponse(
        "Not Model for database " + databaseString + " found!",
        4002
      )
    );

  try {
    let deleteArray = [];

    if (isArray) {
      for (let i = 0; i < data.length; i++) {
        let object = data[i];
        if (object._id) {
          deleteArray.push(object._id);
        }
      }
    } else {
      if (data._id) {
        deleteArray.push(data._id);
      }
    }
    if (deleteArray.length > 0) {
      let deleteData = await modelObject.deleteMany({ _id: deleteArray });
      if (deleteData) res.status(200).json(true);
      else next(new ErrorResponse("EscendiaController.Delete.NoData", 401));
    } else {
      return next(new ErrorResponse("EscendiaController.Delete.NoData", 401));
    }
  } catch (err) {
    return next(new ErrorResponse(err, 401));
  }
};

function convertFilterObjectToObjectIds(filterObject, modelObject) {
  var keyList = Object.keys(filterObject);
  for (var key in Object.keys(filterObject)) {
    if (
      modelObject.schema.paths[keyList[key]] !== undefined &&
      modelObject.schema.paths[keyList[key]].instance == "ObjectID"
    ) {
      filterObject[keyList[key]] = new mongoose.Types.ObjectId(
        filterObject[keyList[key]]
      );
    }
  }
}

exports.getDataRoute = async (req, res, next) => {
  //console.log("getDataRoute", req, res);
  let filterObject = req.query.filter !== undefined ? req.query.filter : {};
  let databaseString =
    filterObject.database !== undefined ? filterObject.database : undefined;
  if (databaseString === undefined) return next(new ErrorResponse("NODATABASE"));
  delete filterObject.database;

  let modelObject = getModelObject(databaseString);

  if (modelObject === undefined) return next(new ErrorResponse("NOMODEL"));

  convertFilterObjectToObjectIds(filterObject, modelObject);
  //console.log("convertFilterObjectToObjectIds", filterObject, modelObject);

  try {
    // Check that user exists by email
    let objects = await modelObject
      .find(filterObject)
      .populate(getPopulate(databaseString));

    //console.log("objects", objects);

    //if (objects === undefined || objects.length === 0) return next(new ErrorResponse("No values found", 401));
    res.status(200).json(objects);
  } catch (err) {
    //console.log("ERROR", err);
    return next(new ErrorResponse(err));
  }
};

exports.putDataRoute = async (req, res, next) => {
  let databaseString = undefined;
  let isArray = Array.isArray(req.body);

  if (isArray) {
    databaseString =
      req.body[0].database !== undefined ? req.body[0].database : undefined;
  } else {
    databaseString =
      req.body.database !== undefined ? req.body.database : undefined;
  }
  if (databaseString === undefined) return next(new ErrorResponse("NODATABASE"));

  let modelObject = getModelObject(databaseString);
  if (modelObject === undefined) return next(new ErrorResponse("NOMODEL"));

  try {
    // Check that user exists by email
    var updateDataArray = [];
    var createDataArray = [];

    if (isArray) {
      for (let i = 0; i < req.body.length; i++) {
        let value = req.body[i];
        if (value._id) {
          updateDataArray.push(value);
        } else {
          createDataArray.push(value);
        }
      }
    } else {
      let value = req.body;
      if (value._id) {
        updateDataArray.push(value);
      } else {
        createDataArray.push(value);
      }
    }

    let updatedDataObject = [];
    if (createDataArray.length > 0) {
      let newDataObjects = await modelObject.insertMany(createDataArray);

      if (newDataObjects.length > 0) {
        for (let i = 0; i < newDataObjects.length; i++) {
          objects = await modelObject
            .findOne({ _id: newDataObjects[i]._id })
            .populate(getPopulate(databaseString));
          updatedDataObject.push(objects);
        }
      }
    }

    if (updateDataArray.length > 0) {
      for (let i = 0; i < updateDataArray.length; i++) {
        objects = await modelObject
          .findOne({ _id: updateDataArray[i]._id })
          .populate(getPopulate(databaseString));
        objects.overwrite(updateDataArray[i]);
        objects = await objects.save();
        updatedDataObject.push(objects);
      }
    }

    res.status(200).json(updatedDataObject);
    return;
  } catch (err) {
    return next(new ErrorResponse(err, 401));
  }
};

function getModelObject(databaseName) {
  switch (databaseName) {
    case "attribute":
      return Attribute;
    case "userType":
      return UserType;
    case "user":
      return User;
    default:
      return undefined;
  }
}

const getPopulate = (databaseName) => {
  var populate = [];
  //console.log("databasename", databaseName);

  populate.push({ path: "createdBy", model: "user", strictPopulate: false });
  populate.push({
    path: "statusChangedBy",
    model: "user",
    strictPopulate: false,
  });

  switch (databaseName) {
    case "attribute": {
      break;
    }
    case "user": {
      populate.push({
        path: "userType",
        model: "userType",
        strictPopulate: false,
      });
      break;
    }
    case "userType": {
      break;
    }
  }

  return populate;
};
