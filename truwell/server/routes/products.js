const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// GET all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, sort, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (featured) query.isFeatured = true;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];

    const sortOptions = {
      'price-asc': { price: 1 }, 'price-desc': { price: -1 },
      'newest': { createdAt: -1 }, 'rating': { 'ratings.average': -1 }
    };

    const products = await Product.find(query)
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);
    res.json({ products, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE product (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE product (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD review
router.post('/:id/review', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.reviews.push({ user: req.user._id, userName: req.user.name, rating, comment });
    const total = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.ratings = { average: total / product.reviews.length, count: product.reviews.length };
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SEED sample products
router.post('/seed/demo', async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = [
      {
        name: 'Paracetamol 500mg Tablets', slug: 'paracetamol-500mg',
        description: 'Effective pain relief and fever reducer. Suitable for adults and children over 12.',
        shortDesc: 'Fast-acting pain & fever relief', price: 2.99, comparePrice: 3.99,
        category: 'otc', stock: 150, sku: 'TRW-OTC-001', brand: 'Truwell Own Brand',
        tags: ['pain relief', 'fever', 'paracetamol'], isFeatured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', alt: 'Paracetamol' }],
        ratings: { average: 4.8, count: 124 }
      },
      {
        name: 'Vitamin C 1000mg Effervescent', slug: 'vitamin-c-1000mg',
        description: 'High-strength Vitamin C tablets to support immune function and reduce tiredness.',
        shortDesc: 'Immune support & energy boost', price: 8.49, comparePrice: 11.99,
        category: 'vitamins', stock: 80, sku: 'TRW-VIT-001', brand: 'NutriPlus',
        tags: ['vitamin c', 'immune', 'energy'], isFeatured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=400', alt: 'Vitamin C' }],
        ratings: { average: 4.6, count: 89 }
      },
      {
        name: 'Ibuprofen 400mg Tablets', slug: 'ibuprofen-400mg',
        description: 'Anti-inflammatory pain relief for headaches, muscle pain, dental pain and period pain.',
        shortDesc: 'Anti-inflammatory pain relief', price: 3.49, comparePrice: 4.99,
        category: 'otc', stock: 120, sku: 'TRW-OTC-002',
        tags: ['ibuprofen', 'pain', 'inflammation'], isFeatured: false,
        images: [{ url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400', alt: 'Ibuprofen' }],
        ratings: { average: 4.5, count: 67 }
      },
      {
        name: 'Omega 3 Fish Oil 1000mg', slug: 'omega-3-fish-oil',
        description: 'High quality Omega-3 fatty acids supporting heart, brain and joint health.',
        shortDesc: 'Heart & brain health support', price: 12.99, comparePrice: 16.99,
        category: 'vitamins', stock: 60, sku: 'TRW-VIT-002', brand: 'OmegaCare',
        tags: ['omega 3', 'heart health', 'fish oil'], isFeatured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', alt: 'Omega 3' }],
        ratings: { average: 4.7, count: 203 }
      },
      {
        name: 'SPF 50+ Sunscreen Travel Kit', slug: 'spf50-sunscreen-travel',
        description: 'Complete travel sunscreen kit with SPF 50+ protection for face and body. Essential for travel health.',
        shortDesc: 'Complete travel sun protection', price: 18.99,
        category: 'travel-health', stock: 45, sku: 'TRW-TRV-001',
        tags: ['sunscreen', 'travel', 'SPF 50'], isFeatured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400', alt: 'Sunscreen' }],
        ratings: { average: 4.9, count: 56 }
      },
      {
        name: 'First Aid Kit Deluxe', slug: 'first-aid-kit-deluxe',
        description: 'Comprehensive 50-piece first aid kit for home and travel. Includes bandages, antiseptic, and emergency guides.',
        shortDesc: '50-piece comprehensive kit', price: 24.99, comparePrice: 34.99,
        category: 'first-aid', stock: 30, sku: 'TRW-FA-001',
        tags: ['first aid', 'bandages', 'emergency'], isFeatured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400', alt: 'First Aid Kit' }],
        ratings: { average: 4.8, count: 91 }
      },
      {
        name: 'Moisturising Face Cream SPF15', slug: 'moisturising-face-cream',
        description: 'Daily moisturiser with SPF15 protection. Hydrates skin and protects against UV damage.',
        shortDesc: 'Daily moisture + UV protection', price: 14.50,
        category: 'skincare', stock: 55, sku: 'TRW-SK-001', brand: 'DermaCare',
        tags: ['moisturiser', 'SPF', 'skincare'], isFeatured: false,
        images: [{ url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', alt: 'Face Cream' }],
        ratings: { average: 4.4, count: 78 }
      },
      {
        name: 'Antihistamine Tablets 10mg', slug: 'antihistamine-10mg',
        description: 'Non-drowsy antihistamine for hay fever, allergies and skin reactions. 30 tablets.',
        shortDesc: 'Non-drowsy allergy relief', price: 5.99, comparePrice: 7.99,
        category: 'otc', stock: 100, sku: 'TRW-OTC-003',
        tags: ['allergy', 'antihistamine', 'hay fever'],
        images: [{ url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400', alt: 'Antihistamine' }],
        ratings: { average: 4.3, count: 145 }
      }
    ];
    await Product.insertMany(products);
    res.json({ message: `${products.length} products seeded successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
