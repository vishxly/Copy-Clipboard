const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Link', LinkSchema);