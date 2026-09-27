# 🤝 Contributing to Vachanam (వచనం • Vachanam • वचन)

Thank you for your interest in contributing to **Vachanam**! This project is dedicated to building a production-ready, open multilingual digital Bible platform for churches, pastors, theology students, and families worldwide.

---

## 📜 Code of Conduct

We are committed to providing a welcoming, respectful, and encouraging environment for all contributors. Please treat fellow contributors with grace, patience, and kindness.

---

## 🛠️ Development Workflow

1. **Fork the repository** on GitHub.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/vachanam.git
   cd vachanam
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up local database**:
   ```bash
   npm run db:push
   npm run db:seed
   ```
5. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
6. **Start local servers**:
   ```bash
   npm run dev
   ```

---

## 🧪 Testing Guidelines

Before submitting a Pull Request, run the automated test suite and ensure all tests pass:

```bash
# Run server REST API tests
npm test

# Verify frontend Next.js production build
npm run build --workspace=frontend
```

---

## 🎨 Code Style & Standards

- **JavaScript**: Use modern ES6+ syntax (JavaScript is used for frontend and backend as specified).
- **Styling**: Use Tailwind CSS utility classes and design tokens defined in `frontend/src/app/globals.css`.
- **Multilingual Support**: All user-facing strings must be added to `frontend/src/lib/i18n.js` in Telugu (`te`), English (`en`), and Hindi (`hi`).
- **No Login Requirements**: Keep all core Bible study features publicly accessible without authentication.
- **Security**: Protect admin/maintenance endpoints with `x-admin-key` header verification.

---

## 📬 Submitting a Pull Request

1. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a **Pull Request** against `main`.
3. Describe your changes clearly in the PR template.
4. Ensure CI checks pass.

Thank you for building tools for the glory of God and the blessing of believers worldwide!
