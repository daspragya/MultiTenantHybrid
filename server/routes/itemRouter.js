const express = require("express");
const router = express.Router();
const itemCtrl = require("../controllers/itemCtrl");

router.get("/items", itemCtrl.getItems);
router.get("/item/:itemId", itemCtrl.getItemById);
router.post("/item", itemCtrl.createItem);
router.put("/item/:itemId", itemCtrl.updateItem);
router.delete("/item/:itemId", itemCtrl.deleteItem);

module.exports = router;
