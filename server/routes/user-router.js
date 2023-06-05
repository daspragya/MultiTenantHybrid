const express = require("express");

const UserCtrl = require("../controllers/user-ctrl");

const router = express.Router();

router.post("/signup", [UserCtrl.checkDuplicateUser], UserCtrl.signUp);
router.post("/signin", UserCtrl.signIn);

module.exports = router;
