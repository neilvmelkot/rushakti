const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name:  { type: String, default: '' },
  role:  { type: String, default: '' },
  photo: { type: String, default: '' },
});

const contentSchema = new mongoose.Schema({
  applyEnabled: { type: Boolean, default: true },
  eboard:       [memberSchema],
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
