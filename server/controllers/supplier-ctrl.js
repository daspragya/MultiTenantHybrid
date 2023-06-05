const Supplier = require("../models/supplier-model");
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = {
  secret: "your-secret-key-2",
};

//middlewares
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token-supplier"];

  if (!token) {
    return res.status(403).send({ message: "No token provided for supplier!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ message: "Please register with a supplier!" });
    }
    req.supplierId = decoded.id;
    next();
  });
};

checkDuplicateSupplier = async (req, res, next) => {
  Supplier.findOne({
    name: req.body.name,
  })
    .then((supplier) => {
      if (supplier) {
        res.status(400).send({
          message: "Failed! Supplier already in use.",
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
signUp = (req, res) => {
  const supplier = new Supplier({
    name: req.body.name,
    desc: req.body.desc,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  supplier
    .save()
    .then(() => {
      return res.status(201).json({
        sucess: true,
        message: "Supplier registered!",
      });
    })
    .catch((error) => {
      return res.status(500).json({
        sucess: false,
        error,
        message: "Supplier not created!",
      });
    });
};

signIn = async (req, res) => {
  await Supplier.findOne({ name: req.body.name }).then((supplier) => {
    if (!supplier) {
      return res.status(404).json({
        success: false,
        accessToken: null,
        message: "Supplier Not Found",
      });
    } else {
      var PasswordIsValid = bcrypt.compareSync(
        req.body.password,
        supplier.password
      );
      if (!PasswordIsValid) {
        return res.status(401).send({
          success: false,
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      User.findOne({ suppliers: supplier._id, _id: req.userId })
        .then((user) => {
          if (!user) {
            return res.status(401).json({
              success: false,
              message: "Supplier not associated with this user",
            });
          }

          var token = jwt.sign({ id: supplier.id }, config.secret, {
            expiresIn: 3600, // 1 hour
          });

          return res.status(200).json({
            success: true,
            id: supplier._id,
            name: supplier.name,
            desc: supplier.desc,
            accessToken: token,
          });
        })
        .catch((err) => {
          return res.status(500).json({
            success: false,
            error: err,
          });
        });
    }
  });
};

const getSupplierNames = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    const suppliers = [];
    for (const supplierID of user.suppliers) {
      const supplier = await Supplier.findOne({ _id: supplierID });
      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: "Supplier Not Found",
        });
      }
      suppliers.push(supplier.name);
    }

    res.status(200).json({ success: true, suppliers });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  signUp,
  verifyToken,
  checkDuplicateSupplier,
  signIn,
  getSupplierNames,
};
