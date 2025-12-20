const mongoose = require('mongoose');
const { type } = require('node:os');

const inventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Please provide an item name.'],
    unique: true,
  },

  quantity: {
    type: Number,
    required: [true, 'Please provide a quantity.'],
    default: 0,
    min: [0, 'Quantity cannot be negative.'],
  },

});

const Inventory = mongoose.model('Item', inventorySchema);
module.exports = Inventory;