const express = require("express");

const connection = require("../connection");
const router = express.Router();

const jwt = require("jsonwebtoken");
require("dotenv").config();

var auth = require("../services/authentication");
var checkRole = require("../services/checkRole");

router.post("/register", (req, res) => {
  //the api call like user/signup
  let user = req.body;
  query = "select email,password,role,status from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        query =
          "insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')";
        connection.query(
          query,
          [user.name, user.contactNumber, user.email, user.password],
          (err, results) => {
            if (!err) {
              return res.status(200).json({
                statusCode: 200,
                message: "successfully registered",
                request: "success",
              });
            } else {
              return res.status(500).json(err);
            }
          }
        );
      } else {
        return res.status(400).json({
          statusCode: 400,
          message: "Email Already Existed",
          request: "failed",
        });
      }
    } else {
      return res
        .status(500)
        .json({ statusCode: 400, message: err, request: "failed" });
    }
  });
});

router.post("/login", (req, res) => {
  const user = req.body;
  query = "select name,email,password,role,status from user where email=?";

  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0 || results[0].password != user.password) {
        return res.status(401).json({
          token: null,
          request: "failed",
          message: "incorrect username or password",
          statusCode: 401,
        });
      } else if (results[0].status == "false") {
        return res.status(401).json({
          token: null,
          request: "failed",
          message: "waiting for admin approval",
          statusCode: 401,
        });
      } else if (results[0].password == user.password) {
        const response = {
          email: results[0].email,
          role: results[0].role,
          username: results[0].name,
        };

        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
          expiresIn: "8h",
        });

        res.status(200).json({
          token: accessToken,
          request: "success",
          message: "login successfully",
          statusCode: 200,
        });
      } else {
        return res.status(400).json({
          token: null,
          request: "failed",
          message: "something went wrong try again later",
          statusCode: 400,
        });
      }
    } else {
      return res.status(500).json({
        token: null,
        request: "failed",
        message: err,
        statusCode: 500,
      });
    }
  });
});

router.post("/forgetpassword", (req, res) => {
  const user = req.body;

  query = "select email,password from user where email=?";

  connection.query(query, [user.email], (err, result) => {
    if (!err) {
      if (result.length <= 0) {
        return res.status(401).json({ warning: "invalid user" });
      } else {
        return res.status(200).json({ password: result[0].password });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get("/get-all-user", (req, res) => {
  query =
    "select id,name,email,status,contactNumber from user where role='user'";

  connection.query(query, (err, result) => {
    if (!err) {
      return res.status(201).json(result);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.patch(
  "/update-user-status",

  (req, res) => {
    let user = req.body;
    query = "update user set status=? where id=?";

    connection.query(query, [user.status, user.id], (err, result) => {
      if (!err) {
        if (result.affectedRows == 0) {
          return res.status(404).json({ message: "User id not existed" });
        } else {
          return res
            .status(201)
            .json({ id: user.id, message: "role changed successfully " });
        }
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

router.get("/checktoken", auth.authenticateToken, (req, res) => {
  return res.status(200).json({ message: true });
});

router.post("/updatepassword", auth.authenticateToken, (req, res) => {
  var user = req.body;
  var email = res.locals.email;
  // var old = user.oldPassword;
  //var newps = user.oldPassword;
  if (user.oldPassword == user.newPassword) {
    return res
      .status(400)
      .json({ message: "new pasword not must be the old password" }); //400 is bad request dude
  }

  query = "select email,password from user where email=? and password=?";

  connection.query(query, [email, user.oldPassword], (err, result) => {
    if (!err) {
      if (result.length <= 0) {
        return res.status(400).json({ message: " incorrect old password " });
      } else if (result[0].password == user.oldPassword) {
        query = "update user set password=? where email=?";
        connection.query(query, [user.newPassword, email], (err, results) => {
          if (err) {
            res.status(500).json(err);
          }
          return res
            .status(200)
            .json({ message: "password updated successfully" });
        });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

module.exports = router;
