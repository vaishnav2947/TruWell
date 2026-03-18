const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  shortDesc: { type: String },
  price: { type: Number, required: true, min: 0 },
  comparePrice: { type: Number },
  category: {
    type: String,
    enum: ['prescription', 'otc', 'vitamins', 'skincare', 'first-aid', 'baby', 'personal-care', 'travel-health'],
    required: true
  },
  images: [{ url: String, alt: String }],
  stock: { type: Number, default: 0 },
  sku: { type: String, unique: true },
  requiresPrescription: { type: Boolean, default: false },
  brand: { type: String },
  tags: [String],
  ingredients: [String],
  dosage: { type: String },
  warnings: [String],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  deliveryInfo: { type: String, default: 'Free UK delivery in 2-3 business days' }
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
