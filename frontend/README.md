# automateERP Frontend ⚛️

This is the React-based frontend for **automateERP**, designed with a premium, high-performance UI inspired by Stripe and Linear.

## 🚀 Tech Stack

- **React 19** — The latest React features including improved hooks and concurrent rendering.
- **Vite 8** — Next-generation frontend tooling for near-instant HMR.
- **Tailwind CSS v4** — Utility-first styling with high-performance CSS-in-JS capabilities.
- **Lucide React** — Elegant and consistent icon set.
- **Vitest & React Testing Library** — Modern testing booth for components and integration flows.

## 📦 Key Modules

- **Home Launcher** — Odoo-style app switcher with glassmorphic design.
- **Inventory & POS** — Comprehensive product management and real-time sales terminal.
- **Projects & Kanban** — Task management with drag-and-drop capability.
- **Financial Analytics** — High-fidelity charts for revenue and expense tracking.

## 🛠️ Getting Started

### Development
```bash
npm install
npm run dev
```

### Testing
```bash
npm run test        # Run unit tests
npm run coverage    # Generate LCOV coverage report
npm run lint        # Check for code quality issues
```

### Production Build
```bash
npm run build
npm run preview     # Preview the production bundle locally
```

## 📁 Architecture

- `src/components/ui/` — Atomic UI components (`Button`, `Card`, `Badge`).
- `src/components/` — Feature-specific modules (`Inventory`, `POS`, `Dashboard`).
- `src/App.jsx` — Central routing and layout orchestration.
