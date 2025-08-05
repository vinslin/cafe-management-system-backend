require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.get("authorization"); //packet header la irnthu edukkurathu

  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
    if (err) {
      return res.sendStatus(401);
    }

    res.locals = response; //local storage mathiri then easy ya fetch pannalam //userinfor =res.locals
    next();
  });
}

module.exports = { authenticateToken: authenticateToken };
