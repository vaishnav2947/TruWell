const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    postcode: String,
    country: { type: String, default: 'UK' }
  },
  role: { type: String, enum: ['customer', 'admin', 'pharmacist'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  savedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
