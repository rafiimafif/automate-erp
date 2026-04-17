<div align="center">

<h1>⚡ automateERP</h1>

<p><strong>A modern, full-featured ERP platform for startups and SMEs — managing everything from inventory and sales to HR, financials, and integrations in one beautiful interface.</strong></p>

[![CI](https://github.com/rafiimafif/automate-erp/actions/workflows/ci.yml/badge.svg)](https://github.com/rafiimafif/automate-erp/actions/workflows/ci.yml)
[![CD](https://github.com/rafiimafif/automate-erp/actions/workflows/cd.yml/badge.svg)](https://github.com/rafiimafif/automate-erp/actions/workflows/cd.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=rafiimafif_automate-erp&metric=alert_status)](https://sonarcloud.io/dashboard?id=rafiimafif_automate-erp)

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://docker.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Django](https://img.shields.io/badge/Django-5-092E20?logo=django&logoColor=white)](https://djangoproject.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

</div>

---

## ✨ Overview

**automateERP** is a modern, lightweight, and production-ready ERP system built with a decoupled architecture — a **React + Vite** frontend powered by a **Django REST Framework** backend, fully containerized with **Docker**.

Designed with a **Stripe/Linear/Vercel-inspired premium UI**, automateERP replaces bloated legacy ERPs with a fast, intuitive, and beautifully crafted interface featuring glassmorphism, AI-powered insights, a reusable `shadcn`-style component library, and deep micro-interactions that your team will actually enjoy using.

---

## 🚀 Feature Modules

| Module | Description |
|---|---|
| 🏠 **SaaS Homepage** | Premium dark-gradient hero section, personalized greeting, Quick Stats row, Quick Actions bar, enriched module cards with live status badges, and AI Smart Insights panel |
| 📊 **Dashboard** | Hero Revenue card with embedded chart, glassmorphic topbar, AI Insight banner, Sales Composition & Budget reports, dark-mode Activity Timeline, and floating Quick Actions FAB |
| 📦 **Inventory** | Full product catalog with SKU tracking, stock levels, status badges, and CRUD operations |
| 🗂️ **Projects** | Multi-level management — Projects grid view → Kanban task boards with status & priority |
| 🛒 **POS Terminal** | Real-time cashier interface with cart, quantity controls, taxes, and payment flow |
| 🔄 **Subscriptions** | SaaS billing management — MRR calculations, seat licensing, and billing cycles |
| 🧾 **Expenses** | Employee reimbursement workflow with spend analytics and one-click approval/rejection |
| 🛒 **Sales & Invoices** | Create, edit, and delete invoices with dynamic status tracking (Paid / Pending / Overdue) |
| 👥 **Customers** | Client directory with profile avatars, contact info, and total lifetime value tracking |
| 🗂️ **Sales Pipeline** | Kanban-style deal board with stage-based card management (Lead → Contacted → Negotiating → Won) |
| 🚚 **Suppliers & POs** | Vendor directory and Purchase Order management — tabbed interface with full CRUD |
| 👔 **HR & Payroll** | Employee directory with department badges, salary tracking, and headcount analytics |
| 🔌 **Integrations Hub** | 32 pre-built integration cards across 8 categories |
| 🎨 **Design System** | Reusable `shadcn`-style UI component library (`Button`, `Card`, `Badge`, `Table`) with premium shadows, glassmorphism, and hover-lift interactions |
| 🚀 **CI/CD Pipeline** | Automated workflows for linting, testing, security scanning (Trivy), and SonarCloud |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** — Component-driven UI
- **Vite 8** — Lightning-fast dev server and build tool
- **Tailwind CSS v4** — Utility-first styling with custom animations
- **Lucide React** — Consistent, modern icon library

### Backend
- **Python 3.10** — Stable and performant runtime
- **Django 5** — Battle-tested web framework
- **Django REST Framework** — API-first architecture
- **SQLite** — Default database (zero-config, portable to PostgreSQL)

### CI/CD & Security
- **GitHub Actions** — Automated CI/CD pipelines
- **SonarCloud** — Continuous code quality & security analysis
- **Trivy** — Vulnerability scanner for containers
- **GHCR** — GitHub Container Registry for image hosting

### Infrastructure
- **Docker + Docker Compose** — Fully containerized development and deployment
- **Vite Dev Server** — Hot Module Replacement with volume mounts

---

## 📁 Project Structure

```
automate-erp/
├── .github/workflows/          # CI/CD pipelines (CI & CD)
├── docker-compose.yml          # Orchestrates backend + frontend containers
│
├── backend/                    # Django REST API
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   ├── core/                   # Project settings & root URL config
│   └── api/                    # Main app: Models, Views, Serializers
│       ├── models.py
│       ├── views.py
│       └── serializers.py
│
└── frontend/                   # React SPA
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── postcss.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx             # Root layout, auth gate, glassmorphic topbar & pill sidebar
        ├── index.css           # Tailwind v4 imports, premium shadows & custom animations
        ├── main.jsx
        └── components/
            ├── ui/                # shadcn-style generic UI components
            │   ├── Button.jsx     # Variants: default, outline, ghost, danger
            │   ├── Card.jsx       # Glassmorphic container with hover-lift
            │   ├── Badge.jsx      # Semantic status badges
            │   └── Table.jsx      # Clean tabular data components
            ├── Login.jsx          # Auth page with animated background
            ├── Home.jsx           # Premium SaaS homepage with hero, stats & insights
            ├── Dashboard.jsx      # Hero revenue card, reports, AI insights, timeline
            ├── Projects.jsx       # Project grid & Kanban boards
            ├── POS.jsx            # Point of Sale terminal
            ├── Subscriptions.jsx  # SaaS billing & MRR tracking
            ├── Expenses.jsx       # Reimbursement & approval flow
            ├── Inventory.jsx      # Product management
            ├── Sales.jsx          # Invoice tracking
            ├── Customers.jsx      # CRM directory
            ├── Pipeline.jsx       # Kanban deal board
            ├── Accounting.jsx     # Financial reporting
            ├── Suppliers.jsx      # Vendor & PO management
            ├── HR.jsx             # Employee & payroll
            └── Integrations.jsx   # 3rd-party integrations hub
```

---

## 🐳 Quick Start with Docker (Recommended)

> **Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) must be installed and running.

```bash
# 1. Clone the repository
git clone https://github.com/rafiimafif/automate-erp.git
cd automate-erp

# 2. Build and start all containers
docker-compose up --build -d

# 3. Access the application
#    Frontend: http://localhost:5173
#    Backend API: http://localhost:8000/api
```

**Default credentials:**
```
Username: admin
Password: admin
```

---

## 💻 Local Development (Without Docker)

### Backend (Django)
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
python manage.py makemigrations api
python manage.py migrate
python manage.py runserver
```
> API available at: `http://127.0.0.1:8000/api/`

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
> App available at: `http://127.0.0.1:5173/`

---

## 🔌 Integrations Supported

automateERP includes a ready-to-configure integrations hub covering:

| Category | Services |
|---|---|
| 💳 **Payments** | Stripe, PayPal, QuickBooks, Xero |
| 🛍️ **E-Commerce** | Shopify, WooCommerce, Amazon, eBay |
| 💬 **Communication** | Slack, Microsoft Teams, Zoom, Discord |
| ✉️ **Email** | Resend, Mailchimp, SendGrid, HubSpot |
| 📈 **Analytics** | PostHog, Sentry, Datadog, Google Analytics |
| 🗃️ **Storage** | Airtable, Google Sheets, Notion, AWS S3 |
| 📦 **Logistics** | FedEx, DHL, ShipStation, UPS |
| 🔐 **Security** | Clerk, Okta SSO, Cloudflare, 1Password |

---

## 🔮 Roadmap

- [ ] **Real Authentication** — JWT token auth via Django Simple JWT + Clerk SSO
- [ ] **Live API Integration** — Wire all frontend CRUD operations to the Django REST backend
- [ ] **PostgreSQL Support** — Production-grade database with Docker volume persistence
- [ ] **Multi-Tenancy** — Isolated workspaces per organization for SaaS deployment
- [ ] **Stripe Billing** — Subscription tiers limiting features per plan
- [ ] **Role-Based Access Control** — Granular permissions per employee department
- [ ] **Email Notifications** — Invoice delivery and low-stock alerts via Resend
- [x] **Modular UI** — Odoo-style home launcher with standalone app feel
- [x] **Premium SaaS UI** — Stripe/Linear-grade redesign with glassmorphism, AI insights, reusable component library, and deep micro-interactions
- [x] **CI/CD Pipeline** — GitHub Actions workflow with automated Docker builds, SonarCloud, and Trivy security scanning
- [ ] **AWS Deployment** — Terraform IaC for scalable cloud infrastructure

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open a pull request or file an issue.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/rafiimafif">Rafi Imafif</a></p>
</div>
