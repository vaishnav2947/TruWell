const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect, adminOnly } = require('../middleware/auth');

// Book appointment
router.post('/', async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json({ appointment, message: 'Appointment booked successfully! We will confirm shortly.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get available slots for a date
router.get('/slots', async (req, res) => {
  try {
    const { date } = req.query;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const booked = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'cancelled' }
    }).select('timeSlot');

    const allSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];

    const bookedSlots = booked.map(a => a.timeSlot);
    const available = allSlots.filter(s => !bookedSlots.includes(s));
    res.json({ available });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// User's appointments
router.get('/my', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ email: req.user.email }).sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: all appointments
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
