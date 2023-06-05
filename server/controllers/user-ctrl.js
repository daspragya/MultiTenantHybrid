const User = require("../models/user-model");
const Supplier = require("../models/supplier-model");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = {
  secret: "your-secret-key",
};

//middlewares
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "Please sign in!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Token Invalid!" });
    }
    req.userId = decoded.id;
    next();
  });
};

checkDuplicateUser = async (req, res, next) => {
  User.findOne({
    username: req.body.username,
  })
    .then((user) => {
      if (user) {
        res.status(400).send({
          message: "Failed! Username already in use.",
        });
        return;
      }
      next();
    })
    .catch((err) => {
      res.status(500).send({ message: err });
      return;
    });
};

//Controllers for authentication
const signUp = async (req, res) => {
  try {
    let foundSuppliers = [];

    if (req.body.hasOwnProperty("suppliers")) {
      const suppliers = req.body.suppliers;

      for (const supplier of suppliers) {
        const result = await Supplier.findOne({ _id: supplier });
        if (result) {
          foundSuppliers.push(supplier);
        } else {
          throw new Error("Supplier not found!");
        }
      }
    }

    const user = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      suppliers: foundSuppliers,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: "User not created!",
    });
  }
};

signIn = async (req, res) => {
  await User.findOne({ username: req.body.username }).then((user) => {
    if (!user) {
      return res.status(404).json({
        sucess: false,
        accessToken: null,
        message: "User Not Found",
      });
    } else {
      var PasswordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!PasswordIsValid) {
        return res.status(401).send({
          sucess: false,
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 3600, // 1 hours
      });
      return res.status(200).json({
        sucess: true,
        id: user._id,
        username: user.username,
        accessToken: token,
      });
    }
  });
};

module.exports = {
  signUp,
  verifyToken,
  checkDuplicateUser,
  signIn,
};
