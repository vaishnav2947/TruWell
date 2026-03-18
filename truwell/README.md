# 🏥 Truwell Pharmacy — Full-Stack E-Commerce Web App

A complete pharmacy e-commerce platform built with **React**, **Express.js**, and **MongoDB**.

---

## 🎨 Brand
- **Primary Orange:** `#E8521A`
- **Primary Teal:** `#1A5C50`
- **Fonts:** Playfair Display (headings) + DM Sans (body)

---

## 🗂 Project Structure

```
truwell/
├── server/                  ← Express.js backend
│   ├── index.js             ← Server entry point
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Appointment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── cart.js
│   │   ├── services.js
│   │   ├── appointments.js
│   │   └── payment.js
│   └── middleware/
│       └── auth.js
└── client/                  ← React frontend
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        ├── api.js            ← Axios API layer
        ├── index.css         ← Global styles + CSS variables
        ├── context/
        │   ├── AuthContext.js
        │   └── CartContext.js
        ├── components/
        │   ├── Navbar.js
        │   ├── Footer.js
        │   └── ProductCard.js
        └── pages/
            ├── Home.js
            ├── Shop.js
            ├── ProductDetail.js
            ├── Cart.js
            ├── Checkout.js
            ├── Services.js
            ├── Appointments.js
            ├── Login.js
            ├── Register.js
            ├── Account.js
            └── OrderSuccess.js
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js ≥ 16
- MongoDB running locally (`mongod`) — or use MongoDB Atlas

### 2. Install Dependencies

```bash
# Root (server)
npm install

# Client
cd client && npm install && cd ..
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values:
# MONGO_URI=mongodb://localhost:27017/truwell_pharmacy
# JWT_SECRET=your_secret_here
# STRIPE_SECRET_KEY=sk_test_...  (optional for payments)
```

### 4. Run Dev Servers

```bash
# From project root — starts both server (port 5000) + client (port 3000)
npm run dev
```

Or separately:
```bash
npm run server    # Express on :5000
npm run client    # React on :3000
```

### 5. Seed Sample Products

After the app is running, go to:
```
http://localhost:3000
```
On the homepage, if no products are shown, click **"Load Sample Products"** — or hit the API directly:
```
POST http://localhost:5000/api/products/seed/demo
```

---

## 🌟 Features

### 🛒 E-Commerce
| Feature | Details |
|---|---|
| Product catalogue | Search, filter by category, sort by price/rating/newest |
| Product detail | Images, ratings, reviews, dosage info |
| Shopping cart | Add/remove/update qty, persisted in localStorage |
| Checkout flow | 3-step: delivery → payment → review |
| Order management | Order history, tracking, status updates |
| Free UK delivery | Shown on all products and checkout |

### 🏥 Pharmacy-Specific
| Feature | Details |
|---|---|
| Prescription products | `Rx` badge, consultation booking prompt |
| NHS Services | Healthy Living, Blood Pressure, Pharmacy First, Stop Smoking, Contraception |
| Private Consultations | Travel Health, Weight Management, Women's/Men's Health, Skin & Cosmetic |
| Appointment booking | 3-step wizard: service → details → date/time picker |
| Same-day appointments | Slots from 09:00–18:00, Mon–Fri |

### 👤 User Accounts
| Feature | Details |
|---|---|
| Register / Login | JWT-based auth, bcrypt password hashing |
| Profile management | Update name, phone, delivery address |
| Order history | View all past orders with status badges |
| Prescriptions tab | Upload prescription (UI ready, needs storage integration) |

### 🔧 Admin / Backend
| Endpoint | Description |
|---|---|
| `POST /api/auth/register` | Register new user |
| `POST /api/auth/login` | Login, returns JWT |
| `GET /api/products` | List products (search, filter, paginate) |
| `POST /api/products` | Create product (admin) |
| `POST /api/products/seed/demo` | Seed 8 demo products |
| `POST /api/orders` | Create order |
| `GET /api/orders/my-orders` | User's orders |
| `GET /api/services` | All pharmacy services |
| `POST /api/appointments` | Book appointment |
| `GET /api/appointments/slots?date=` | Available time slots |

---

## 💳 Payment Integration

Payment is mocked in dev mode. To enable real Stripe payments:

1. Add your key to `.env`: `STRIPE_SECRET_KEY=sk_live_...`
2. Update `server/routes/payment.js` to use the real Stripe SDK (commented code is there)
3. Install Stripe on the client: `cd client && npm install @stripe/react-stripe-js @stripe/stripe-js`

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 6, Axios, React Toastify |
| Backend | Express.js 4, Node.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT + bcryptjs |
| Payments | Stripe (mock in dev) |
| Styling | Pure CSS with CSS variables — no external UI library |

---

## 📞 Truwell Pharmacy Contact
- **Address:** 6A Courtland Road, Rosehill, Oxford, OX4 4JA
- **Phone:** 01865 777836
- **Email:** info@truwellpharmacy.com
- **Website:** truwellpharmacy.co.uk
- **Hours:** Mon–Fri, 9:00–18:30
