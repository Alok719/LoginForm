const jwt = require("jsonwebtoken");
const Register = require("../models/registers");
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const userVerify = await jwt.verify(token, process.env.SECRET_KEY);
    // console.log(userVerify);
    const user = await Register.findOne({ _id: userVerify._id });
    // console.log(user.name);

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send(error);
  }
};
module.exports = auth;
