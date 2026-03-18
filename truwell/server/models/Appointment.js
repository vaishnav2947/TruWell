const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  serviceType: {
    type: String,
    enum: [
      'private-consultation', 'travel-health', 'weight-management',
      'womens-health', 'mens-health', 'skin-cosmetic', 'blood-pressure',
      'stop-smoking', 'pharmacy-first', 'vaccination', 'nhs-consultation'
    ],
    required: true
  },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  notes: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  isNHS: { type: Boolean, default: false },
  reminderSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
