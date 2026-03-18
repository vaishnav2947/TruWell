const express = require('express');
const router = express.Router();

const SERVICES = [
  { id: 'private-consultation', name: 'Pharmacist-led Private Consultations', type: 'private', icon: '🩺', description: 'Confidential & personalised care from our qualified pharmacists', duration: 30, price: 0 },
  { id: 'travel-health', name: 'Travel Health & Specialist Advice', type: 'private', icon: '✈️', description: 'Vaccines, health checks & tailored travel advice', duration: 45, price: 0 },
  { id: 'weight-management', name: 'Weight Management Clinic', type: 'private', icon: '⚖️', description: 'Personalised weight loss plans and support', duration: 60, price: 0 },
  { id: 'womens-health', name: "Women's Health Clinic", type: 'private', icon: '🌸', description: "Specialist women's health advice and services", duration: 45, price: 0 },
  { id: 'mens-health', name: "Men's Health Clinic", type: 'private', icon: '💪', description: "Specialist men's health advice and services", duration: 45, price: 0 },
  { id: 'skin-cosmetic', name: 'Skin & Cosmetic Services', type: 'private', icon: '✨', description: 'Professional skin assessments and cosmetic consultations', duration: 30, price: 0 },
  { id: 'vaccination', name: 'Private Vaccinations', type: 'private', icon: '💉', description: 'Wide range of private vaccinations available', duration: 20, price: 0 },
  { id: 'nhs-consultation', name: 'Healthy Living Pharmacy Advice', type: 'nhs', icon: '🏥', description: 'Free NHS healthy living advice', duration: 20, price: 0 },
  { id: 'pharmacy-first', name: 'Pharmacy First Services', type: 'nhs', icon: '🔷', description: 'NHS-funded consultations for common conditions', duration: 20, price: 0 },
  { id: 'blood-pressure', name: 'Blood Pressure Monitoring', type: 'nhs', icon: '❤️', description: 'Free blood pressure checks and advice', duration: 15, price: 0 },
  { id: 'stop-smoking', name: 'Stop Smoking Service', type: 'nhs', icon: '🚭', description: 'NHS-funded stop smoking support programme', duration: 30, price: 0 },
  { id: 'contraception', name: 'Pharmacy Contraception Service', type: 'nhs', icon: '💊', description: 'Free NHS contraception consultations', duration: 20, price: 0 }
];

router.get('/', (req, res) => res.json(SERVICES));
router.get('/nhs', (req, res) => res.json(SERVICES.filter(s => s.type === 'nhs')));
router.get('/private', (req, res) => res.json(SERVICES.filter(s => s.type === 'private')));

module.exports = router;
