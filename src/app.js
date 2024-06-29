require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
require("./db/conn");
const Register = require("./models/registers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const view_path = path.join(__dirname, "../views");
app.set("view engine", "hbs");
app.set("views", view_path);
app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/", async (req, res) => {
  try {
    const password = req.body.userPassword;
    const cpassword = req.body.ConfirmPassword;
    if (password === cpassword) {
      const registerEmploy = new Register({
        name: req.body.userName,
        email: req.body.UserEmail,
        password: req.body.userPassword,
        confirmPassword: req.body.ConfirmPassword,
      });
      const token = await registerEmploy.generateAuthToken();
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 30000),
        httpOnly: true,
      });
      const registred = await registerEmploy.save();
      res.status(201).render("login");
    } else {
      res.send("paswords are not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const password = req.body.userPassword;
    const email = req.body.UserEmail;
    const userEmail = await Register.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, userEmail.password);
    const token = await userEmail.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 30000),
      httpOnly: true,
      // secure:true
    });
    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.send("passwords are not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`server is Live at ${port}`);
});
