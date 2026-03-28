const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const schema = new mongoose.Schema({
  username:  { type: String, required: true, unique: true, trim: true },
  password:  { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

schema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

schema.methods.comparePassword = function(candidate) {
  return require('bcryptjs').compare(candidate, this.password);
};

module.exports = mongoose.model('Admin', schema);
