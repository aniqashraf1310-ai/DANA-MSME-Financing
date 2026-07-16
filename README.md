# DANA — MSME Digital Financing & Loan Management Platform

## Start locally

### Database
1. Start MySQL.
2. Run `database/schema.sql`.

### API
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### React client
```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173. API health check: http://localhost:5000/api/health.

## Branch strategy
- `main`: stable presentation/release code only.
- `develop`: combined development branch.
- `feature/*`: one feature per branch.
- `test/integration-testing`: cross-module testing.

Feature branches should be created from `develop`, then merged back through pull requests.

## Recommended assignment
- Danish: applicant module, applications, repayment/payment, frontend integration.
- Aniq: loan officer, bidding, products, disbursement proof, admin/logging.
- Shared: database, authentication, testing, documentation.
