// let pdf = require("html-pdf");
// let connection = require("../connection");
// let auth = require("../services/authentication");
// let checkRole = require("../services/checkRole");
// let express = require("express");
// let router = express.Router();
// let fs = require("fs");
// let path = require("path");

// router.post("/generateReport", (req, res) => {
//   const generatedUuid = randomUUID.v1();
//   const orderDetails = req.body;
//   var productDetailsReport = JSON.parse(orderDetails.productDetails);

//   var query="insert into bill(name,uuid,email,contactNumber,paymentMethod,total,productDetails,createdBy) values(?,?,?,?,?,?,?,?)";
//   connection.query(query, [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.total, JSON.stringify(productDetailsReport), orderDetails.createdBy], (err, result) => {

// });
