# Tornado Money 🌪️

Find bank/credit-union account bonuses (checking, savings, CDs) that fit the cash you have on hand — and track what you've claimed and earned.

**100% free, 100% private.** There's no backend, no accounts, no analytics. Everything — your cash amount, custom offers, claimed-offer history — lives only in this browser's `localStorage`. The app's only network request is fetching its own public `offers.json` data file; no personal data is ever sent anywhere.

## Data

`public/offers.json` is a hand-curated snapshot of real, currently active checking/savings/CD bonus offers, each with a source URL and a `lastVerified` date. Offers change frequently — always verify details on the bank's site before opening an account.

A daily scheduled agent (see `/schedule`) keeps this file refreshed automatically. `src/data/offers.fallback.ts` mirrors it for offline/first-load-failure cases.

## Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```
