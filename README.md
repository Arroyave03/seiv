# Money App

Minimal personal finance app built with Expo, React Native, TypeScript, Expo Router, Zustand, and SQLite.

## What this base includes

The first version is intentionally narrow:

- monthly income
- fixed expenses
- savings goal
- available balance
- recent transactions
- monthly progress indicator

## Structure

- `src/app/` for Expo Router screens and the root layout
- `src/components/` for reusable UI primitives
- `src/features/` for screen-specific composition and seeded data
- `src/store/` for Zustand state
- `src/database/` for local SQLite access
- `src/services/` for future auth and sync contracts
- `src/types/` for shared domain types
- `src/utils/` for formatting and math helpers
- `src/constants/` for design tokens and layout values

This keeps the app modular without pushing it into an overengineered layered architecture.

## Run it

1. Install dependencies.

   ```bash
   npm install
   ```

2. Start Expo.

   ```bash
   npm run start
   ```

3. Open it on iPhone simulator, Android emulator, or Expo Go.

## Local-first flow

On launch, the app:

1. opens the SQLite database
2. creates the `dashboard_snapshot` table if needed
3. seeds mock financial data on first run
4. hydrates Zustand from local storage

That makes the first product loop work offline and gives you a real path toward later CRUD and sync.

## Next steps

1. Add a transaction form screen and connect it to the store.
2. Split the snapshot into normalized SQLite tables when the model grows.
3. Add sync and auth contracts in `src/services/` when backend work starts.
4. Add tests for the formatter, store selectors, and repository layer.
