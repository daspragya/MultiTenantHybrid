const Item = require("../models/itemModel");

createItem = (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide an item",
    });
  }
  const item = new Item(body);
  if (!item) {
    return res.status(400).json({ success: false, error: error });
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

  Item.findOne({ _id: req.params.itemId }).then((item) => {
    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Item not found!",
      });
    }

    const { price, desc } = body;
    item.price = price;
    item.desc = desc;

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
  });
};

deleteItem = (req, res) => {
  Item.findOneAndDelete({ _id: req.params.itemId })
    .then((item) => {
      if (!item) {
        return res
          .status(404)
          .json({ success: false, error: "Item not found" });
      }

      return res.status(200).json({ success: true, data: item });
    })
    .catch((error) => {
      return res.status(404).json({ success: false, error: "Item not found" });
    });
};

getItemById = (req, res) => {
  Item.findOne({ _id: req.params.itemId })
    .then((item) => {
      if (!item) {
        return res
          .status(404)
          .json({ success: false, error: "Item not found" });
      }

      return res.status(200).json({ success: true, data: item });
    })
    .catch((error) => {
      return res.status(404).json({ success: false, error: "Item not found" });
    });
};

getItems = (req, res) => {
  Item.find()
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
