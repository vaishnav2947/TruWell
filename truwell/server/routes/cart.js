const express = require('express');
const router = express.Router();
// Cart is managed on client side (localStorage/context)
// This route can be used for server-side cart persistence if needed

router.get('/validate', async (req, res) => {
  // Validate cart items are still in stock
  try {
    const Product = require('../models/Product');
    const { items } = req.body;
    const validated = [];
    for (const item of items || []) {
      const product = await Product.findById(item.productId);
      if (product && product.isActive && product.stock >= item.quantity) {
        validated.push({ ...item, valid: true, currentPrice: product.price });
      } else {
        validated.push({ ...item, valid: false, reason: product ? 'Insufficient stock' : 'Product unavailable' });
      }
    }
    res.json({ validated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
