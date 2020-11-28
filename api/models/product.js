const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  productImage: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Product', productSchema);
