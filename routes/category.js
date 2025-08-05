const express = require("express");
const connection = require("../connection");
const router = express.Router();

const jwt = require("jsonwebtoken");
require("dotenv").config();

let auth = require("../services/authentication");
let checkRole = require("../services/checkRole");

router.post("/add-category", (req, res) => {
  let category = req.body;

  const query = "select name from category where name=?";

  connection.query(query, [category.name], (err, result) => {
    if (!err) {
      if (result.length > 0) {
        return res.status(400).json({
          name: category.name,
          message: "catergory name is already existed",
        });
      }
    } else {
      return res.status(500).json(err);
    }

    const query1 = "insert into category(name) values(?)";

    connection.query(query1, [category.name], (err, results) => {
      if (!err) {
        return res.status(200).json({
          name: category.name,
          message: "category created successfully",
        });
      } else {
        return res.status(500).json(err);
      }
    });
  });
});

router.get("/get-all-categaories", (req, res) => {
  query = "select id,name from category";

  connection.query(query, (err, result) => {
    if (!err) {
      return res.status(201).json(result);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.patch(
  "/update-category",

  (req, res) => {
    let category = req.body;
    query = "update category set name=? where id=?";

    connection.query(query, [category.name, category.id], (err, result) => {
      if (!err) {
        if (result.affectedRows == 0) {
          return res.status(404).json({
            id: category.id,
            name: category.name,
            message: "category id not existed",
          });
        } else {
          return res.status(201).json({
            id: category.id,
            name: category.name,
            message: "category name  changed successfully ",
          });
        }
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

router.get("/get-category-count", (req, res) => {
  query = "select COUNT(name) from category";

  connection.query(query, (err, result) => {
    if (!err) {
      const cnt = result[0]["COUNT(name)"];
      return res
        .status(201)
        .json({ count: cnt, message: "category count fetched successfully" });
    } else {
      return res.status(500).json(err);
    }
  });
});

module.exports = router;
