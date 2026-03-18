const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/create-intent', protect, async (req, res) => {
  try {
    // In production, use real Stripe:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.create({ amount: req.body.amount * 100, currency: 'gbp' });

    // Mock response for demo
    res.json({
      clientSecret: 'pi_demo_' + Date.now() + '_secret_demo',
      amount: req.body.amount,
      message: 'Payment intent created. Connect real Stripe key to process payments.'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
