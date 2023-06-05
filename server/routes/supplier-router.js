const express = require("express");

const UserCtrl = require("../controllers/user-ctrl");
const SupplierCtrl = require("../controllers/supplier-ctrl");

const router = express.Router();

router.post(
  "/signup",
  [SupplierCtrl.checkDuplicateSupplier],
  SupplierCtrl.signUp
);
router.post("/signin", [UserCtrl.verifyToken], SupplierCtrl.signIn);

module.exports = router;
