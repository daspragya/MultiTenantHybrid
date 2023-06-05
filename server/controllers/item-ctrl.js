const Item = require("../models/item-model");

createItem = (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide an item",
    });
  }

  body.supplier = req.supplierId;
  const item = new Item(body);

  if (!item) {
    return res.status(400).json({ success: false, error: err });
  }

  item
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: item._id,
        message: "Item created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Item not created!",
      });
    });
};

updateItem = (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update",
    });
  }

  Item.findOne({ _id: req.params.id, supplier: req.supplierId }).then(
    (item) => {
      if (!item) {
        return res.status(404).json({
          success: false,
          error: "Item not found!",
        });
      }

      item.price = body.price;
      item.desc = body.desc;

      item
        .save()
        .then(() => {
          return res.status(200).json({
            success: true,
            id: item._id,
            message: "Item updated!",
          });
        })
        .catch((error) => {
          return res.status(404).json({
            error,
            message: "Item not updated!",
          });
        });
    }
  );
};

deleteItem = (req, res) => {
  Item.findOneAndDelete({ _id: req.params.id, supplier: req.supplierId })
    .then((item) => {
      if (!item) {
        return res
          .status(404)
          .json({ success: false, error: "Item not found" });
      }

      return res.status(200).json({ success: true, data: item });
    })
    .catch((error) => {
      return res.status(400).json({ success: false, error });
    });
};

getItemById = (req, res) => {
  Item.findOne({ _id: req.params.id, supplier: req.supplierId })
    .then((item) => {
      if (!item) {
        return res
          .status(404)
          .json({ success: false, error: "Item not found" });
      }

      return res.status(200).json({ success: true, data: item });
    })
    .catch((error) => {
      return res.status(400).json({ success: false, error });
    });
};

getItems = (req, res) => {
  Item.find({ supplier: req.supplierId })
    .then((items) => {
      if (!items.length) {
        return res
          .status(404)
          .json({ success: false, error: "Items not found" });
      }

      return res.status(200).json({ success: true, data: items });
    })
    .catch((error) => {
      return res.status(400).json({ success: false, error });
    });
};

module.exports = {
  createItem,
  updateItem,
  deleteItem,
  getItems,
  getItemById,
};
