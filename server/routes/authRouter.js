const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authCtrl");

router.post("/login", authCtrl.signin);
router.post("/signup", authCtrl.signup);
router.get("/logout", authCtrl.signOutUser);
router.get("/tenantNames", authCtrl.getTenantNames);
router.post("/switch", authCtrl.switchTenant);

module.exports = router;
