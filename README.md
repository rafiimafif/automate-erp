# automateERP
> A modern, lightweight ERP designed for startups and SMEs to manage inventory, sales, and core operations without the bloat.

## 🚀 Features

automateERP focuses on delivering an API-first backend with a clean, minimal, and modern frontend inspired by Linear and Stripe.

- 🔐 **Authentication & User Management:** Simplified Role-Based Access Control (Admin vs. Staff).
- 📦 **Inventory Management:** Track SKUs, manage stock quantities, and view low-stock alerts instantly.
- 🛒 **Sales & Invoices:** Process orders, track billing status (Pending/Paid/Shipped), and unify revenue data.
- ⚡ **Quick Actions:** Create invoices and add stock via context menus explicitly designed to save time.
- 🔔 **Activity Log & Notifications:** Real-time visibility into who did what (e.g., "John updated stock for Product A").

## 🛠️ Tech Stack 

- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons, ShadCN aesthetics.
- **Backend:** Python, Django 4, Django REST Framework, Simple JWT.
- **Database:** SQLite (default for MVP), easily portable to PostgreSQL for production.

## 📦 Project Structure

The codebase follows an API-first monolithic pattern, decoupled for SaaS scale:
```
automateERP/
├── backend/                  # Django REST API 
│   ├── core/                 # Settings, Main URLs Configuration
│   ├── api/                  # Unified MVC: Models, Views, Serializers
│   │   ├── models.py         # Includes User, Product, Order, ActivityLog
│   │   ├── views.py          # DRF ViewSets
│   └── manage.py
└── frontend/                 # React SPA
    ├── src/
    │   ├── App.jsx           # Modern Dashboard Implementation
    │   └── index.css         # Tailwind directives
    ├── tailwind.config.js
    └── package.json
```

## 💻 Installation

### 1. Setup the Backend API (Django)
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py makemigrations api
python manage.py migrate
python manage.py runserver
```
*(The backend runs on `http://127.0.0.1:8000/api/`)*

### 2. Setup the Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*(The frontend runs on `http://127.0.0.1:5173/`)*

---

### 🎨 Dashboard Preview
> [!NOTE]
> *(Upload your screenshots here! Example placeholder below:)*
> 
> ![Dashboard Preview](./placeholder.jpg)

### 🔮 Future Roadmap & Monetization (SaaS)
This project is structured specifically to support a scalable **Multi-tenant SaaS ERP**:
1. **Docker & CI/CD Deployment:** Move to AWS via Terraform and containerize the backend/frontend with Nginx.
2. **Subscription Tiers:** Limit Quick Actions, Reporting, or Staff accounts based on monthly Stripe subscriptions.
3. **Webhooks:** Trigger external inventory tools using simple Python Signals.
