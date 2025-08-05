const express = require("express");
const connection = require("../connection");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
let auth = require("../services/authentication");
let checkRole = require("../services/checkRole");

router.post("/add-product", (req, res) => {
  let product = req.body;
  var query = "select name from product where name=?";

  connection.query(query, [product.name], (err, result) => {
    if (!err) {
      if (result.length > 0) {
        return res.status(400).json({
          name: product.name,
          message: "Product name already exists",
        });
      }
    } else {
      return res.status(500).json(err);
    }

    query =
      "INSERT INTO product(name, categoryId, description, price, status) VALUES (?, ?, ?, ?, 'true')";
    connection.query(
      query,
      [product.name, product.categoryId, product.description, product.price],
      (err, results) => {
        if (!err) {
          return res.status(200).json({
            name: product.name,
            message: "Product created successfully",
          });
        } else {
          return res.status(500).json(err);
        }
      }
    );
  });
});

router.get("/get-all-products", (req, res) => {
  query =
    "SELECT p.id, p.name, p.categoryId, p.description, p.price,p.status,c.name as categoryName FROM product p JOIN category c ON p.categoryId = c.id";

  connection.query(query, (err, result) => {
    if (!err) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get("/get-by-category/:id", (req, res) => {
  const productId = req.params.id;
  query =
    "SELECT p.id, p.name, p.categoryId, p.description, p.price,p.status,c.name as categoryName FROM product p JOIN category c ON p.categoryId = c.id WHERE p.categoryId = ?";
  connection.query(query, [productId], (err, result) => {
    if (!err) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get("/get-by-id/:id", (req, res) => {
  const productId = req.params.id;
  query =
    "SELECT p.id, p.name, p.categoryId, p.description, p.price,p.status,c.name as categoryName FROM product p JOIN category c ON p.categoryId = c.id WHERE p.id = ?";
  connection.query(query, [productId], (err, result) => {
    if (!err) {
      if (result.length > 0) {
        return res.status(200).json(result[0]);
      } else {
        return res.status(404).json({ message: "Product not found" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.patch("/update-product", (req, res) => {
  let product = req.body;
  query =
    "UPDATE product SET name=?, categoryId=?, description=?, price=? WHERE id=?";

  connection.query(
    query,
    [
      product.name,
      product.categoryId,
      product.description,
      product.price,
      product.id,
    ],
    (err, result) => {
      if (!err) {
        if (result.affectedRows == 0) {
          return res.status(404).json({ message: "Product not found" });
        } else {
          return res
            .status(200)
            .json({ id: product.id, message: "Product updated successfully" });
        }
      } else {
        return res.status(500).json(err);
      }
    }
  );
});

router.delete("/delete-product/:id", (req, res) => {
  const productId = req.params.id;
  query = "DELETE FROM product WHERE id=?";
  connection.query(query, [productId], (err, result) => {
    if (!err) {
      if (result.affectedRows == 0) {
        return res.status(404).json({ message: "Product not found" });
      } else {
        return res
          .status(200)
          .json({ message: "Product deleted successfully" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.patch("/update-product-status", (req, res) => {
  let product = req.body;
  query = "UPDATE product SET status=? WHERE id=?";

  connection.query(query, [product.status, product.id], (err, result) => {
    if (!err) {
      if (result.affectedRows == 0) {
        return res.status(404).json({ message: "Product not found" });
      } else {
        return res.status(200).json({
          id: product.id,
          status: product.status,
          message: "Product status updated successfully",
        });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get("/get-product-count", (req, res) => {
  query = "SELECT COUNT(id) AS productCount FROM product";
  connection.query(query, (err, result) => {
    if (!err) {
      const count = result[0].productCount;
      if (count === 0) {
        return res
          .status(200)
          .json({ message: "No products found", count: count });
      }
      return res
        .status(200)
        .json({ message: "Product count got successfully", count: count });
    } else {
      return res.status(500).json(err);
    }
  });
});
module.exports = router;
