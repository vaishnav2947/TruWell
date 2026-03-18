const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1 },
    image: String,
    requiresPrescription: Boolean
  }],
  shippingAddress: {
    name: String,
    street: { type: String, required: true },
    city: { type: String, required: true },
    postcode: { type: String, required: true },
    country: { type: String, default: 'UK' },
    phone: String
  },
  paymentInfo: {
    method: { type: String, enum: ['card', 'paypal', 'nhs-exempt'] },
    stripePaymentIntentId: String,
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' }
  },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'],
    default: 'pending'
  },
  prescriptionUploaded: { type: Boolean, default: false },
  prescriptionUrl: { type: String },
  notes: { type: String },
  trackingNumber: { type: String },
  estimatedDelivery: { type: Date }
}, { timestamps: true });

orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `TRW-${Date.now()}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
