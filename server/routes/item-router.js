const express = require("express");

const ItemCtrl = require("../controllers/item-ctrl");
const UserCtrl = require("../controllers/user-ctrl");
const SupplierCtrl = require("../controllers/supplier-ctrl");

const router = express.Router();

router.post(
  "/item",
  [UserCtrl.verifyToken, SupplierCtrl.verifyToken],
  ItemCtrl.createItem
);
router.put(
  "/item/:id",
  [UserCtrl.verifyToken, SupplierCtrl.verifyToken],
  ItemCtrl.updateItem
);
router.delete(
  "/item/:id",
  [UserCtrl.verifyToken, SupplierCtrl.verifyToken],
  ItemCtrl.deleteItem
);
router.get(
  "/item/:id",
  [UserCtrl.verifyToken, SupplierCtrl.verifyToken],
  ItemCtrl.getItemById
);
router.get(
  "/items",
  [UserCtrl.verifyToken, SupplierCtrl.verifyToken],
  ItemCtrl.getItems
);

router.get("/suppliers", [UserCtrl.verifyToken], SupplierCtrl.getSupplierNames);

module.exports = router;
